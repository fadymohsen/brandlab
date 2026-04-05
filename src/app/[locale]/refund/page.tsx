"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";

export default function RefundPage() {
  const dict = useDictionary();

  return (
    <>
      <Navbar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-cream">
            {dict.refundPage.title}{" "}
            <span className="gradient-text">{dict.refundPage.titleHighlight}</span>
          </h1>
          <p className="mt-6 text-sm text-cream/40">{dict.refundPage.lastUpdated}</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-10">
          {dict.refundPage.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-2xl font-bold text-cream mb-4">{section.title}</h2>
              <p className="text-cream/60 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
