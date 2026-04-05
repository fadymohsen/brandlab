"use client";

import { Play, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll, StaggerChildren, StaggerItem } from "./animations";

const gradients = [
  "from-primary to-secondary",
  "from-secondary to-accent",
  "from-accent to-primary",
  "from-primary via-secondary to-accent",
  "from-secondary to-primary",
  "from-accent via-secondary to-primary",
];

export default function Portfolio() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

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
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            {dict.portfolio.subtitle}
          </p>
        </RevealOnScroll>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dict.portfolio.items.map((project, index) => (
            <StaggerItem key={project.title}>
              <motion.div
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={`aspect-video bg-gradient-to-br ${gradients[index]} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Play size={24} className="text-white fill-white ms-1" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark via-dark/80 to-transparent">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-semibold text-cream mt-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-cream/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.description}
                  </p>
                </div>
                <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <ExternalLink size={16} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <RevealOnScroll className="text-center mt-12" delay={0.3}>
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {dict.portfolio.cta}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
