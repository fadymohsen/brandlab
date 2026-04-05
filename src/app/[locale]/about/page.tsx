"use client";

import { Target, Zap, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";

const valueIcons = [Target, Zap, Heart, Award];

export default function AboutPage() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.about.label}
          </span>
          <h1 className="mt-4 text-5xl lg:text-7xl font-bold text-cream">
            {dict.about.pageTitle}{" "}
            <span className="gradient-text">
              {dict.about.pageTitleHighlight}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/60">
            {dict.about.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-cream mb-10">
            {dict.about.story.title}{" "}
            <span className="gradient-text">
              {dict.about.story.titleHighlight}
            </span>
          </h2>
          <div className="space-y-6">
            {dict.about.story.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-cream/60 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-dark-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="gradient-border p-10">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  {dict.about.mission.title}
                </h3>
                <p className="text-cream/60 text-lg leading-relaxed">
                  {dict.about.mission.description}
                </p>
              </div>
            </div>
            <div className="gradient-border p-10">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  {dict.about.vision.title}
                </h3>
                <p className="text-cream/60 text-lg leading-relaxed">
                  {dict.about.vision.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-cream">
              {dict.about.title}{" "}
              <span className="gradient-text">
                {dict.about.titleHighlight}
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dict.about.values.map((value, index) => {
              const Icon = valueIcons[index];
              return (
                <div key={value.title} className="gradient-border p-8 text-center">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                      <Icon size={28} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-cream mb-3">
                      {value.title}
                    </h3>
                    <p className="text-cream/50">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-dark-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-cream">
              {dict.about.team.title}{" "}
              <span className="gradient-text">
                {dict.about.team.titleHighlight}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
              {dict.about.team.subtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dict.about.team.members.map((member) => (
              <div key={member.name} className="gradient-border p-8 text-center">
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                    {member.name[0]}
                  </div>
                  <h3 className="text-lg font-semibold text-cream">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mt-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-cream/50 mt-3">{member.bio}</p>
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
            {dict.about.ctaSection.title}{" "}
            <span className="gradient-text">
              {dict.about.ctaSection.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-cream/50 text-lg">
            {dict.about.ctaSection.subtitle}
          </p>
          <Link
            href={`/${locale}/#contact`}
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {dict.about.ctaSection.button}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
