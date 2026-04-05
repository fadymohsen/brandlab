"use client";

import { Play, ExternalLink, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "@/components/LeadPopupProvider";

const gradients = [
  "from-primary to-secondary",
  "from-secondary to-accent",
  "from-accent to-primary",
  "from-primary via-secondary to-accent",
  "from-secondary to-primary",
  "from-accent via-secondary to-primary",
];

export default function PortfolioPage() {
  const dict = useDictionary();
  const { open } = useLeadPopup();

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
            {dict.portfolio.label}
          </span>
          <h1 className="mt-4 text-5xl lg:text-7xl font-bold text-cream">
            {dict.portfolio.pageTitle}{" "}
            <span className="gradient-text">
              {dict.portfolio.pageTitleHighlight}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/60">
            {dict.portfolio.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {dict.portfolio.items.map((project, index) => (
              <div
                key={project.title}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                <div
                  className={`aspect-video bg-gradient-to-br ${gradients[index]} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                    <Play size={32} className="text-white fill-white ms-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-dark via-dark/80 to-transparent">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-semibold text-cream mt-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-cream/50 mt-2">
                    {project.description}
                  </p>
                </div>
                <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <ExternalLink size={16} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-cream">
            {dict.portfolio.ctaSection.title}{" "}
            <span className="gradient-text">
              {dict.portfolio.ctaSection.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-cream/50 text-lg">
            {dict.portfolio.ctaSection.subtitle}
          </p>
          <button
            onClick={open}
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {dict.portfolio.ctaSection.button}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
