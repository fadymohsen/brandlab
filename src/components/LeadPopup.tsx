"use client";

import { useState } from "react";
import { X, Send, ArrowRight } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";

export default function LeadPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dict = useDictionary();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md gradient-border p-8">
        <div className="relative z-10">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute -top-2 -end-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-cream/50 hover:text-cream transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-cream mb-2">
            {dict.leadPopup.title}{" "}
            <span className="gradient-text">{dict.leadPopup.titleHighlight}</span>
          </h2>
          <p className="text-cream/50 text-sm mb-6">{dict.leadPopup.subtitle}</p>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                {dict.leadPopup.name}
              </label>
              <input
                type="text"
                placeholder={dict.leadPopup.namePlaceholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                {dict.leadPopup.email}
              </label>
              <input
                type="email"
                placeholder={dict.leadPopup.emailPlaceholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                {dict.leadPopup.phone}
              </label>
              <input
                type="tel"
                placeholder={dict.leadPopup.phonePlaceholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                {dict.leadPopup.businessField}
              </label>
              <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream/70 focus:outline-none focus:border-primary/50 transition-colors">
                <option value="" className="bg-dark">
                  {dict.leadPopup.businessFieldPlaceholder}
                </option>
                {dict.leadPopup.businessFieldOptions.map((option) => (
                  <option key={option} value={option} className="bg-dark">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-base font-semibold text-white hover:opacity-90 transition-opacity mt-2"
            >
              <Send size={18} />
              {dict.leadPopup.submit}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
