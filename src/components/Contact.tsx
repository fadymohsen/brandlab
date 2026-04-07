"use client";

import { useState } from "react";
import { MessageCircle, Mail, MapPin, Send, ArrowRight } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll, StaggerChildren, StaggerItem } from "./animations";
import PhoneField from "./PhoneField";

const WHATSAPP_NUMBER = "201227742865";

export default function Contact() {
  const dict = useDictionary();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [businessField, setBusinessField] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Hi Brand Lab! 👋`,
      `I'd like to get in touch regarding a project.`,
      ``,
      `*My Details:*`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      projectType ? `Project Type: ${projectType}` : "",
      businessField ? `Business Field: ${businessField}` : "",
      ``,
      `Looking forward to hearing from you!`,
    ].filter((line) => line !== undefined && line !== null);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  }

  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
      >
        <source src="/contact-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-dark/40" />

      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.contact.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.contact.title}{" "}
            <span className="gradient-text">
              {dict.contact.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
            {dict.contact.subtitle}
          </p>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <StaggerChildren className="lg:col-span-2 space-y-8">
            <StaggerItem>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center shrink-0 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-colors">
                  <MessageCircle size={20} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-cream group-hover:text-green-500 transition-colors">{dict.contact.whatsapp}</h3>
                  <p className="text-cream/70 mt-1">{dict.contact.whatsappValue}</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <a
                href="mailto:brandlab12@gmail.com"
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-cream group-hover:text-primary transition-colors">{dict.contact.email}</h3>
                  <p className="text-cream/70 mt-1">{dict.contact.emailValue}</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-cream">
                    {dict.contact.location}
                  </h3>
                  <p className="text-cream/70 mt-1">
                    {dict.contact.locationValue}
                  </p>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="gradient-border p-6 mt-8">
                <div className="relative z-10">
                  <h3 className="font-semibold text-cream mb-2">
                    {dict.contact.guarantee}
                  </h3>
                  <p className="text-sm text-cream/70">
                    {dict.contact.guaranteeText}
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>

          {/* Contact Form */}
          <RevealOnScroll className="lg:col-span-3" direction="right">
            <form
              onSubmit={handleSubmit}
              className="gradient-border p-8"
            >
              <div className="relative z-10 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-2">
                    {dict.contact.form.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={dict.contact.form.namePlaceholder}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <PhoneField
                  label={dict.contact.form.phone}
                  placeholder="+20 122 774 2865"
                  value={phone}
                  onChange={setPhone}
                />

                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-2">
                    {dict.contact.form.projectType}
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream/70 focus:outline-none focus:border-primary/50 transition-colors"
                  >
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
                    {dict.contact.form.businessField}
                  </label>
                  <select
                    value={businessField}
                    onChange={(e) => setBusinessField(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream/70 focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="" className="bg-dark">
                      {dict.contact.form.businessFieldPlaceholder}
                    </option>
                    {dict.contact.form.businessFieldOptions.map((option) => (
                      <option key={option} value={option} className="bg-dark">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="flex btn-primary w-full rounded-xl"
                >
                  <Send size={18} />
                  {dict.contact.form.submit}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
