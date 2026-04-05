"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "@/components/LeadPopupProvider";
import YouTubeShort from "@/components/YouTubeShort";

interface LiveItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  description: string;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function PortfolioPage() {
  const dict = useDictionary();
  const { open } = useLeadPopup();
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (data.items?.length > 0) setLiveItems(data.items);
      })
      .catch(() => {});
  }, []);

  const hasLiveItems = liveItems.length > 0;

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

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {hasLiveItems ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {liveItems.map((item) => {
                const videoId = extractYoutubeId(item.youtubeUrl);
                if (!videoId) return null;
                return (
                  <div key={item.id} className="group">
                    <YouTubeShort videoId={videoId} />
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-semibold text-cream mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-cream/40 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {dict.portfolio.items.map((project) => (
                <div key={project.title} className="gradient-border p-8">
                  <div className="relative z-10">
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
                </div>
              ))}
            </div>
          )}
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
