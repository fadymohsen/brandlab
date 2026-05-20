"use client";

import { useState } from "react";
import { Send, ArrowRight, CheckCircle, Film, Palette, Users } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll, StaggerChildren, StaggerItem } from "./animations";
import PhoneField from "./PhoneField";

const roles = [
  { id: "reel-editor", icon: Film },
  { id: "graphic-designer", icon: Palette },
];

export default function JoinUs() {
  const dict = useDictionary();
  const t = dict.joinUs;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/join-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role, portfolio, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName(""); setEmail(""); setPhone(""); setRole(""); setPortfolio(""); setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {t.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {t.title}{" "}
            <span className="gradient-text">{t.titleHighlight}</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
            {t.subtitle}
          </p>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Roles Info */}
          <StaggerChildren className="lg:col-span-2 space-y-6 min-w-0">
            <StaggerItem>
              <h3 className="text-xl font-bold text-cream mb-4">{t.rolesTitle}</h3>
            </StaggerItem>
            {roles.map((r) => {
              const Icon = r.icon;
              const roleData = t.roles[r.id as keyof typeof t.roles];
              return (
                <StaggerItem key={r.id}>
                  <div className="gradient-border p-6">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <h4 className="font-semibold text-cream">{roleData.title}</h4>
                      </div>
                      <p className="text-cream/70 text-sm leading-relaxed">{roleData.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
            <StaggerItem>
              <div className="gradient-border p-5 sm:p-6">
                <div className="relative z-10 flex items-start gap-3">
                  <Users size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-cream mb-1">{t.whyJoin}</h4>
                    <p className="text-sm text-cream/70">{t.whyJoinText}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>

          {/* Application Form */}
          <RevealOnScroll className="lg:col-span-3 min-w-0" direction="right">
            <form onSubmit={handleSubmit} className="gradient-border p-6 sm:p-8">
              <div className="relative z-10 space-y-6">
                {status === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <p className="text-cream text-lg font-semibold">{t.form.successMessage}</p>
                    <p className="text-cream/60 text-sm mt-2">{t.form.successSub}</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="inline-flex btn-primary mt-6"
                    >
                      {t.form.submitAnother}
                      <ArrowRight size={16} className="rtl:rotate-180" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-cream/70 mb-2">{t.form.name}</label>
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder={t.form.namePlaceholder} required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-cream/70 mb-2">{t.form.email}</label>
                        <input
                          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.form.emailPlaceholder} required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <PhoneField
                        label={t.form.phone}
                        placeholder="+20 1XX XXX XXXX"
                        value={phone}
                        onChange={setPhone}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cream/70 mb-2">{t.form.role}</label>
                      <select
                        value={role} onChange={(e) => setRole(e.target.value)} required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream/70 focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="" className="bg-dark">{t.form.rolePlaceholder}</option>
                        {t.form.roleOptions.map((opt: string) => (
                          <option key={opt} value={opt} className="bg-dark">{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cream/70 mb-2">{t.form.portfolio}</label>
                      <input
                        type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)}
                        placeholder={t.form.portfolioPlaceholder}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cream/70 mb-2">{t.form.message}</label>
                      <textarea
                        value={message} onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.form.messagePlaceholder} rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-red-400 text-sm">{t.form.errorMessage}</p>
                    )}

                    <button
                      type="submit" disabled={status === "sending"}
                      className="flex btn-primary w-full rounded-xl disabled:opacity-50"
                    >
                      <Send size={18} />
                      {status === "sending" ? t.form.sending : t.form.submit}
                      <ArrowRight size={16} className="rtl:rotate-180" />
                    </button>
                  </>
                )}
              </div>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
