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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/i18n/dictionary-provider";
import {
  RevealOnScroll,
  StaggerChildren,
  StaggerItem,
  TiltCard,
} from "./animations";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Film, Scissors, Lightbulb, Monitor, Music, Sparkles,
};

const defaultIcons = [Film, Scissors, Lightbulb, Monitor, Music, Sparkles];

interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
}

export default function Services() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const [items, setItems] = useState<ServiceItem[]>(
    dict.services.items.map((s) => ({ title: s.title, description: s.description }))
  );

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(
            data.items.map((s: { titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string; icon: string }) => ({
              title: locale === "ar" && s.titleAr ? s.titleAr : s.titleEn,
              description: locale === "ar" && s.descriptionAr ? s.descriptionAr : s.descriptionEn,
              icon: s.icon,
            }))
          );
        }
      })
      .catch(() => {});
  }, [locale]);

  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.services.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.services.title}{" "}
            <span className="gradient-text">{dict.services.titleHighlight}</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
            {dict.services.subtitle}
          </p>
        </RevealOnScroll>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((service, index) => {
            const Icon = service.icon
              ? iconMap[service.icon] || defaultIcons[index % defaultIcons.length]
              : defaultIcons[index % defaultIcons.length];
            return (
              <StaggerItem key={service.title}>
                <TiltCard className="gradient-border p-8 h-full">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                      <Icon size={28} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-cream mb-3">
                      {service.title}
                    </h3>
                    <p className="text-cream/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <RevealOnScroll className="text-center mt-12" delay={0.3}>
          <Link
            href={`/${locale}/services`}
            className="inline-flex btn-primary"
          >
            {dict.services.cta}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
