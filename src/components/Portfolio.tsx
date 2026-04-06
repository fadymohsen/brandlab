"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll, StaggerChildren, StaggerItem } from "./animations";
import VideoEmbed from "./VideoEmbed";

interface LiveItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  description: string;
}

export default function Portfolio() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
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
    <section id="portfolio" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.portfolio.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.portfolio.title}{" "}
            <span className="gradient-text">{dict.portfolio.titleHighlight}</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
            {dict.portfolio.subtitle}
          </p>
        </RevealOnScroll>

        {hasLiveItems ? (
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {liveItems.slice(0, 8).map((item) => (
                <StaggerItem key={item.id}>
                  <div className="group">
                    <VideoEmbed url={item.youtubeUrl} />
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-semibold text-cream mt-1 truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </StaggerItem>
            ))}
          </StaggerChildren>
        ) : (
          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dict.portfolio.items.map((project) => (
              <StaggerItem key={project.title}>
                <div className="gradient-border p-6">
                  <div className="relative z-10">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-semibold text-cream mt-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-cream/70 mt-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}

        <RevealOnScroll className="text-center mt-12" delay={0.3}>
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex btn-primary"
          >
            {dict.portfolio.cta}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
