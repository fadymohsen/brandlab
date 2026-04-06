"use client";

import { Target, Zap, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/i18n/dictionary-provider";
import {
  RevealOnScroll,
  StaggerChildren,
  StaggerItem,
  TextReveal,
} from "./animations";

const valueIcons = [Target, Zap, Heart, Award];

export default function About() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <section id="about" className="py-24 lg:py-32 relative bg-dark-light/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <RevealOnScroll>
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                {dict.about.label}
              </span>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream leading-tight">
                {dict.about.title}{" "}
                <span className="gradient-text">{dict.about.titleHighlight}</span>
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="mt-6 text-cream/80 text-lg leading-relaxed">
                <TextReveal text={dict.about.paragraph1} delay={0.3} />
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <p className="mt-4 text-cream/80 text-lg leading-relaxed">
                {dict.about.paragraph2}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="btn-primary text-center"
                >
                  {dict.about.ctaPrimary}
                </a>
                <Link
                  href={`/${locale}/about`}
                  className="btn-secondary text-center"
                >
                  {dict.about.ctaSecondary}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          <StaggerChildren className="grid grid-cols-2 gap-6">
            {dict.about.values.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <StaggerItem
                  key={value.title}
                  className={index % 2 === 1 ? "mt-8" : ""}
                >
                  <div className="gradient-border p-6 h-full">
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-cream mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-cream/70">{value.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
