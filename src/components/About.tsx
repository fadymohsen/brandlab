"use client";

import { Target, Zap, Heart, Award } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";

const valueIcons = [Target, Zap, Heart, Award];

export default function About() {
  const dict = useDictionary();

  return (
    <section id="about" className="py-24 lg:py-32 relative bg-dark-light/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              {dict.about.label}
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream leading-tight">
              {dict.about.title}{" "}
              <span className="gradient-text">{dict.about.titleHighlight}</span>
            </h2>
            <p className="mt-6 text-cream/60 text-lg leading-relaxed">
              {dict.about.paragraph1}
            </p>
            <p className="mt-4 text-cream/60 text-lg leading-relaxed">
              {dict.about.paragraph2}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity text-center"
              >
                {dict.about.ctaPrimary}
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 rounded-full border border-cream/20 text-base font-medium text-cream hover:bg-cream/5 transition-colors text-center"
              >
                {dict.about.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Right - Values */}
          <div className="grid grid-cols-2 gap-6">
            {dict.about.values.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={value.title}
                  className={`gradient-border p-6 ${
                    index % 2 === 1 ? "mt-8" : ""
                  }`}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-cream mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-cream/50">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
