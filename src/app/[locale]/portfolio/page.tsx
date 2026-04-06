"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Film, Scissors, Palette, Monitor, Music, Sparkles } from "lucide-react";
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
}

const categories = [
  "Video Editing",
  "Montage & Reels",
  "Color Grading",
  "Motion Graphics",
  "Sound Design",
  "Brand Identity Videos",
];

const categoryIcons = [Film, Scissors, Palette, Monitor, Music, Sparkles];

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setLiveItems(data.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group items by category
  const groupedByCategory = categories
    .map((cat, index) => ({
      name: cat,
      icon: categoryIcons[index],
      // Match service title from dictionary for localized name
      localizedName: dict.services.items[index]?.title || cat,
      items: liveItems.filter((item) => item.category === cat),
    }))
    .filter((group) => group.items.length > 0);

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
          <p className="mt-6 max-w-2xl mx-auto text-lg text-cream/80">
            {dict.portfolio.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Portfolio grouped by service */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-cream/40">Loading...</div>
          ) : groupedByCategory.length > 0 ? (
            <div className="space-y-20">
              {groupedByCategory.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.name}>
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                        <Icon size={24} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-cream">
                          {group.localizedName}
                        </h2>
                        <p className="text-sm text-cream/40">
                          {group.items.length}{" "}
                          {group.items.length === 1 ? "project" : "projects"}
                        </p>
                      </div>
                    </div>

                    {/* Videos Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {group.items.map((item) => {
                        const videoId = extractYoutubeId(item.youtubeUrl);
                        if (!videoId) return null;
                        return (
                          <div key={item.id}>
                            <YouTubeShort videoId={videoId} />
                            <h3 className="text-sm font-semibold text-cream mt-3 truncate">
                              {item.title}
                            </h3>
                          </div>
                        );
                      })}
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
                    <p className="text-sm text-cream/70 mt-2">
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
          <p className="mt-4 text-cream/70 text-lg">
            {dict.portfolio.ctaSection.subtitle}
          </p>
          <button
            onClick={open}
            className="inline-flex btn-primary mt-8"
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
