"use client";

import {
  Film,
  Scissors,
  Palette,
  Monitor,
  Music,
  Sparkles,
} from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";

const icons = [Film, Scissors, Palette, Monitor, Music, Sparkles];

export default function Services() {
  const dict = useDictionary();

  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.services.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.services.title}{" "}
            <span className="gradient-text">{dict.services.titleHighlight}</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            {dict.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dict.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={service.title}
                className="group gradient-border p-8 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-cream mb-3">
                    {service.title}
                  </h3>
                  <p className="text-cream/50 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
