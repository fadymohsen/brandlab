"use client";

import { Check, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "@/components/LeadPopupProvider";

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
          className={`text-cream/50 shrink-0 ms-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-6 text-cream/50 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const dict = useDictionary();
  const { open } = useLeadPopup();

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/60">
            {dict.pricing.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {dict.pricing.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.02] ${
                  plan.featured
                    ? "bg-gradient-to-b from-primary/20 to-secondary/10 border border-primary/30 glow"
                    : "gradient-border"
                }`}
              >
                <div className="relative z-10">
                  {plan.featured && (
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-white mb-4">
                      {dict.pricing.mostPopular}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-cream">{plan.name}</h3>
                  <p className="text-cream/50 text-sm mt-2">{plan.description}</p>
                  <div className="mt-6 mb-8">
                    <span className="text-5xl font-bold gradient-text">
                      {plan.price}
                    </span>
                    <span className="text-cream/50 ms-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={18} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-cream/70 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={open}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold transition-all ${
                      plan.featured
                        ? "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                        : "border border-cream/20 text-cream hover:bg-cream/5"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </button>
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
          <p className="mt-4 text-cream/50 text-lg">
            {dict.pricing.ctaSection.subtitle}
          </p>
          <button
            onClick={open}
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity"
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
