"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll, StaggerChildren, StaggerItem } from "./animations";

export default function Pricing() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.pricing.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.pricing.title}{" "}
            <span className="gradient-text">{dict.pricing.titleHighlight}</span>{" "}
            {dict.pricing.titleEnd}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            {dict.pricing.subtitle}
          </p>
        </RevealOnScroll>

        <StaggerChildren className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dict.pricing.plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <motion.div
                className={`relative rounded-2xl p-8 h-full ${
                  plan.featured
                    ? "bg-gradient-to-b from-primary/20 to-secondary/10 border border-primary/30 glow"
                    : "gradient-border"
                }`}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                  <a
                    href="#contact"
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold transition-all ${
                      plan.featured
                        ? "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                        : "border border-cream/20 text-cream hover:bg-cream/5"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </a>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <RevealOnScroll className="text-center mt-12" delay={0.3}>
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cream/20 text-base font-medium text-cream hover:bg-cream/5 transition-colors"
          >
            {dict.pricing.cta}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
