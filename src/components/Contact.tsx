"use client";

import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";

export default function Contact() {
  const dict = useDictionary();

  return (
    <section id="contact" className="py-24 lg:py-32 relative bg-dark-light/30">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.contact.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.contact.title}{" "}
            <span className="gradient-text">
              {dict.contact.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            {dict.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-cream">{dict.contact.email}</h3>
                <p className="text-cream/50 mt-1">{dict.contact.emailValue}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <Phone size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-cream">{dict.contact.phone}</h3>
                <p className="text-cream/50 mt-1">{dict.contact.phoneValue}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-cream">
                  {dict.contact.location}
                </h3>
                <p className="text-cream/50 mt-1">
                  {dict.contact.locationValue}
                </p>
              </div>
            </div>

            {/* CTA Box */}
            <div className="gradient-border p-6 mt-8">
              <div className="relative z-10">
                <h3 className="font-semibold text-cream mb-2">
                  {dict.contact.guarantee}
                </h3>
                <p className="text-sm text-cream/50">
                  {dict.contact.guaranteeText}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="gradient-border p-8"
            >
              <div className="relative z-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cream/70 mb-2">
                      {dict.contact.form.name}
                    </label>
                    <input
                      type="text"
                      placeholder={dict.contact.form.namePlaceholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream/70 mb-2">
                      {dict.contact.form.email}
                    </label>
                    <input
                      type="email"
                      placeholder={dict.contact.form.emailPlaceholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-2">
                    {dict.contact.form.projectType}
                  </label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream/70 focus:outline-none focus:border-primary/50 transition-colors">
                    <option value="" className="bg-dark">
                      {dict.contact.form.projectTypePlaceholder}
                    </option>
                    {dict.contact.form.projectTypeOptions.map((option) => (
                      <option key={option} value={option} className="bg-dark">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-2">
                    {dict.contact.form.message}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={dict.contact.form.messagePlaceholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-base font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                  {dict.contact.form.submit}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
