"use client";

import { PhoneCall, ArrowRight } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "./LeadPopupProvider";
import { RevealOnScroll } from "./animations";

export default function BookCall() {
  const dict = useDictionary();
  const { open } = useLeadPopup();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
      >
        <source src="/experts-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-dark/40" />

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <div className="gradient-border p-10 lg:p-14 text-center">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <PhoneCall size={28} className="text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                {dict.bookCall.label}
              </span>
              <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-cream">
                {dict.bookCall.title}{" "}
                <span className="gradient-text">{dict.bookCall.titleHighlight}</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
                {dict.bookCall.subtitle}
              </p>
              <button
                onClick={open}
                className="inline-flex btn-primary mt-8"
              >
                {dict.bookCall.cta}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
