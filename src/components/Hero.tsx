"use client";

import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/i18n/dictionary-provider";
import LeadPopup from "./LeadPopup";

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <Play size={14} className="text-primary fill-primary" />
            <span className="text-sm font-medium text-cream/80">
              {dict.hero.badge}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-cream">{dict.hero.headlineTop}</span>
            <br />
            <span className="gradient-text">{dict.hero.headlineBottom}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-cream/60 leading-relaxed mb-10">
            {dict.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-all flex items-center gap-2 animate-gradient"
            >
              {dict.hero.ctaPrimary}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <Link
              href={`/${locale}/portfolio`}
              className="px-8 py-4 rounded-full border border-cream/20 text-base font-medium text-cream hover:bg-cream/5 transition-colors flex items-center gap-2"
            >
              <Play size={18} className="text-primary" />
              {dict.hero.ctaSecondary}
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {dict.hero.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-cream/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
}
