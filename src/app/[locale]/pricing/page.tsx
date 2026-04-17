"use client";

import { Check, X, ArrowRight, ChevronDown, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "@/components/LeadPopupProvider";
import { useRegion } from "@/components/RegionProvider";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-start"
      >
        <span className="text-lg font-medium text-cream">{question}</span>
        <ChevronDown
          size={20}
          className={`text-cream/70 shrink-0 ms-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-6 text-cream/70 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

interface PlanItem {
  name: string;
  slug: string;
  description: string;
  price: Record<string, string>;
  features: { label: string; included: boolean }[];
  featured: boolean;
}

export default function PricingPage() {
  const dict = useDictionary();
  const { open } = useLeadPopup();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const region = useRegion();

  const [plans, setPlans] = useState<PlanItem[]>(
    dict.pricing.plans.map((p) => ({
      name: p.name, slug: p.slug, description: p.description,
      price: p.price, features: p.features, featured: p.featured,
    }))
  );

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setPlans(
            data.items.map((p: {
              nameEn: string; nameAr: string; slug: string;
              descriptionEn: string; descriptionAr: string;
              priceEg: string; priceInt: string;
              featuresEn: string; featuresAr: string;
              isFeatured: boolean;
            }) => ({
              name: locale === "ar" && p.nameAr ? p.nameAr : p.nameEn,
              slug: p.slug,
              description: locale === "ar" && p.descriptionAr ? p.descriptionAr : p.descriptionEn,
              price: { EG: p.priceEg, INT: p.priceInt },
              features: (locale === "ar" && p.featuresAr ? p.featuresAr : p.featuresEn)
                .split("\n").filter(Boolean)
                .map((f: string) => ({ label: f.trim(), included: true })),
              featured: p.isFeatured,
            }))
          );
        }
      })
      .catch(() => {});
  }, [locale]);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img
          src="/pricing-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.pricing.label}
          </span>
          <h1 className="mt-4 text-5xl lg:text-7xl font-bold text-cream">
            {dict.pricing.pageTitle}{" "}
            <span className="gradient-text">
              {dict.pricing.pageTitleHighlight}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/80">
            {dict.pricing.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.02] ${
                  plan.featured
                    ? "bg-gradient-to-b from-primary/20 to-secondary/10 border border-primary/30 glow"
                    : "gradient-border"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-4 end-4 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30">
                    <Star size={20} className="text-white fill-white" />
                  </div>
                )}
                <div className="relative z-10">
                  {plan.featured && (
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-white mb-4">
                      {dict.pricing.mostPopular}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-cream">{plan.name}</h3>
                  <p className="text-cream/70 text-sm mt-2">{plan.description}</p>
                  <div className="mt-6 mb-2">
                    <span className="text-5xl font-bold gradient-text">
                      {plan.price[region]}
                    </span>
                  </div>
                  <div className="mb-8" />
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature.label} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check size={18} className="text-primary mt-0.5 shrink-0" />
                        ) : (
                          <X size={18} className="text-cream/30 mt-0.5 shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-cream/70" : "text-cream/30"}`}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/payment/${plan.slug}`}
                    className={`flex w-full ${plan.featured ? "btn-primary" : "btn-secondary"}`}
                  >
                    {dict.pricing.subscribe}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-dark-light/30">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-cream">
              {dict.pricing.faq.title}{" "}
              <span className="gradient-text">
                {dict.pricing.faq.titleHighlight}
              </span>
            </h2>
          </div>
          <div>
            {dict.pricing.faq.items.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-cream">
            {dict.pricing.ctaSection.title}{" "}
            <span className="gradient-text">
              {dict.pricing.ctaSection.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-cream/70 text-lg">
            {dict.pricing.ctaSection.subtitle}
          </p>
          <button
            onClick={open}
            className="inline-flex btn-primary mt-8"
          >
            {dict.pricing.ctaSection.button}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
