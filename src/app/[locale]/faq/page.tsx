"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-start"
      >
        <span className="text-lg font-medium text-cream">{question}</span>
        <ChevronDown
          size={20}
          className={`text-cream/50 shrink-0 ms-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-6 text-cream/50 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  const dict = useDictionary();

  return (
    <>
      <Navbar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-cream">
            {dict.faqPage.title}{" "}
            <span className="gradient-text">{dict.faqPage.titleHighlight}</span>
          </h1>
          <p className="mt-6 text-lg text-cream/60">{dict.faqPage.subtitle}</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {dict.faqPage.items.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
