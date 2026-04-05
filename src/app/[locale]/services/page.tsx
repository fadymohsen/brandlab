"use client";

import {
  Film,
  Scissors,
  Palette,
  Monitor,
  Music,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";

const icons = [Film, Scissors, Palette, Monitor, Music, Sparkles];

export default function ServicesPage() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.services.label}
          </span>
          <h1 className="mt-4 text-5xl lg:text-7xl font-bold text-cream">
            {dict.services.pageTitle}{" "}
            <span className="gradient-text">
              {dict.services.pageTitleHighlight}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/60">
            {dict.services.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
          {dict.services.items.map((service, index) => {
            const Icon = icons[index];
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={!isEven ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-cream mb-4">
                    {service.title}
                  </h2>
                  <p className="text-cream/50 text-lg leading-relaxed">
                    {service.detailed}
                  </p>
                </div>
                <div className={!isEven ? "lg:order-1" : ""}>
                  <div
                    className={`aspect-video rounded-2xl bg-gradient-to-br ${
                      index % 3 === 0
                        ? "from-primary/20 to-secondary/10"
                        : index % 3 === 1
                          ? "from-secondary/20 to-accent/10"
                          : "from-accent/20 to-primary/10"
                    } flex items-center justify-center`}
                  >
                    <Icon size={64} className="text-cream/20" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-dark-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-cream">
              {dict.services.processTitle}{" "}
              <span className="gradient-text">
                {dict.services.processTitleHighlight}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
              {dict.services.processSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {dict.services.processSteps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-cream mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-cream/50">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-cream">
            {dict.services.ctaSection.title}{" "}
            <span className="gradient-text">
              {dict.services.ctaSection.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-cream/50 text-lg">
            {dict.services.ctaSection.subtitle}
          </p>
          <Link
            href={`/${locale}/#contact`}
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {dict.services.ctaSection.button}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
