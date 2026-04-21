"use client";

import { useState, useEffect } from "react";
import {
  Film,
  Scissors,
  Lightbulb,
  Monitor,
  Music,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "@/components/LeadPopupProvider";
import { usePathname } from "next/navigation";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Film, Scissors, Lightbulb, Monitor, Music, Sparkles,
};
const defaultIcons = [Film, Scissors, Lightbulb, Monitor, Music, Sparkles];

const serviceImages: Record<number, string> = {
  0: "/services/video-editing.jpg",
  1: "/services/montage-reels.jpg",
  2: "/services/content-creation.jpg",
  3: "/services/motion-graphics.jpg",
  4: "/services/sound-design.jpg",
  5: "/services/brand-identity.jpg",
};

interface ServiceItem {
  title: string;
  description: string;
  detailed: string;
  icon?: string;
}

export default function ServicesPage() {
  const dict = useDictionary();
  const { open } = useLeadPopup();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  const [items, setItems] = useState<ServiceItem[]>(
    dict.services.items.map((s) => ({
      title: s.title,
      description: s.description,
      detailed: s.detailed,
    }))
  );

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(
            data.items.map((s: {
              titleEn: string; titleAr: string;
              descriptionEn: string; descriptionAr: string;
              detailedEn: string; detailedAr: string;
              icon: string;
            }) => ({
              title: locale === "ar" && s.titleAr ? s.titleAr : s.titleEn,
              description: locale === "ar" && s.descriptionAr ? s.descriptionAr : s.descriptionEn,
              detailed: locale === "ar" && s.detailedAr ? s.detailedAr : s.detailedEn,
              icon: s.icon,
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
          src="/services-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.services.label}
          </span>
          <h1 className="mt-4 text-5xl lg:text-7xl font-bold text-cream">
            {dict.services.pageTitle}{" "}
            <span className="gradient-text">
              {dict.services.pageTitleHighlight}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/80">
            {dict.services.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
          {items.map((service, index) => {
            const Icon = service.icon
              ? iconMap[service.icon] || defaultIcons[index % defaultIcons.length]
              : defaultIcons[index % defaultIcons.length];
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={!isEven ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-cream mb-4">
                    {service.title}
                  </h2>
                  <p className="text-cream/70 text-lg leading-relaxed">
                    {service.detailed || service.description}
                  </p>
                </div>
                <div className={!isEven ? "lg:order-1" : ""}>
                  {serviceImages[index] ? (
                    <img
                      src={serviceImages[index]}
                      alt={service.title}
                      className="aspect-video rounded-2xl object-cover w-full"
                    />
                  ) : (
                    <div
                      className={`aspect-video rounded-2xl bg-gradient-to-br ${
                        index % 3 === 0
                          ? "from-primary/20 to-secondary/10"
                          : index % 3 === 1
                            ? "from-secondary/20 to-accent/10"
                            : "from-accent/20 to-primary/10"
                      } flex items-center justify-center`}
                    >
                      <Icon size={64} className="text-cream/20" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-dark-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-cream">
              {dict.services.processTitle}{" "}
              <span className="gradient-text">
                {dict.services.processTitleHighlight}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
              {dict.services.processSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {dict.services.processSteps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-cream mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-cream/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-cream">
            {dict.services.ctaSection.title}{" "}
            <span className="gradient-text">
              {dict.services.ctaSection.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-cream/70 text-lg">
            {dict.services.ctaSection.subtitle}
          </p>
          <button
            onClick={open}
            className="inline-flex btn-primary mt-8"
          >
            {dict.services.ctaSection.button}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
