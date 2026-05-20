"use client";

import { ArrowRight, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll } from "./animations";
import Link from "next/link";

export default function JoinTeamCTA() {
  const dict = useDictionary();
  const t = dict.joinTeamCTA;
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <div className="gradient-border p-10 lg:p-14 text-center">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <Users size={28} className="text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                {t.label}
              </span>
              <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-cream">
                {t.title}{" "}
                <span className="gradient-text">{t.titleHighlight}</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
                {t.subtitle}
              </p>
              <Link
                href={`/${locale}/join-us`}
                className="inline-flex btn-primary mt-8"
              >
                {t.cta}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
