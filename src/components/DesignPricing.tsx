"use client";

import { Sparkles, ArrowRight, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useRegion } from "./RegionProvider";
import { RevealOnScroll, StaggerChildren, StaggerItem } from "./animations";

export default function DesignPricing() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const region = useRegion();

  const section = dict.pricing.designSection;
  const plans = dict.pricing.designPlans;

  return (
    <section
      id="design-pricing"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cream/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-widest">
            <Palette size={16} />
            {section.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {section.title}{" "}
            <span className="text-accent">{section.titleHighlight}</span>{" "}
            {section.titleEnd}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
            {section.subtitle}
          </p>
        </RevealOnScroll>

        <StaggerChildren className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <StaggerItem key={plan.slug}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`group relative h-full rounded-3xl overflow-hidden ${
                  plan.featured
                    ? "bg-gradient-to-br from-accent/15 via-cream/[0.03] to-transparent border-2 border-accent/40"
                    : "bg-cream/[0.02] border-2 border-dashed border-cream/15 hover:border-accent/30"
                } transition-colors duration-300`}
              >
                {/* Decorative corner accent */}
                <div
                  className={`absolute -top-16 -end-16 w-48 h-48 rounded-full blur-3xl ${
                    plan.featured ? "bg-accent/30" : "bg-cream/5"
                  }`}
                />

                <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                  {/* Big number header */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span
                      className={`text-7xl lg:text-8xl font-black leading-none ${
                        plan.featured ? "text-accent" : "text-cream/90"
                      }`}
                    >
                      {plan.count}
                    </span>
                    <span className="text-cream/60 text-lg font-medium uppercase tracking-wider">
                      {plan.countLabel}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-cream">
                      {plan.name}
                    </h3>
                    <p className="text-cream/60 text-sm mt-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className={`h-px w-full mb-6 ${
                      plan.featured
                        ? "bg-accent/30"
                        : "bg-cream/10"
                    }`}
                  />

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <span
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                            plan.featured
                              ? "bg-accent/20 text-accent"
                              : "bg-cream/10 text-cream/70"
                          }`}
                        >
                          <Sparkles size={12} />
                        </span>
                        <span className="text-sm text-cream/80 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-6 border-t border-cream/10 mb-6">
                    <div
                      className={`text-3xl lg:text-4xl font-bold ${
                        plan.featured ? "text-accent" : "text-cream"
                      }`}
                    >
                      {plan.price[region]}
                    </div>
                    <div className="text-cream/40 text-sm">
                      {section.perPack}
                    </div>
                  </div>

                  {/* Full-width CTA */}
                  <Link
                    href={`/${locale}/payment/${plan.slug}`}
                    className={`flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-semibold transition-all ${
                      plan.featured
                        ? "bg-accent text-dark hover:bg-accent/90 shadow-lg shadow-accent/30 hover:shadow-accent/40 hover:-translate-y-0.5"
                        : "border-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
                    }`}
                  >
                    {dict.pricing.subscribe}
                    <ArrowRight
                      size={16}
                      className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
