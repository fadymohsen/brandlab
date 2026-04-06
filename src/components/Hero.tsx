"use client";

import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "./LeadPopupProvider";
import {
  MagneticButton,
  ParallaxFloat,
} from "./animations";

export default function Hero() {
  const dict = useDictionary();
  const { open } = useLeadPopup();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Parallax Background Blobs */}
      <div className="absolute inset-0">
        <ParallaxFloat speed={0.5} direction="up" className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"><span /></ParallaxFloat>
        <ParallaxFloat speed={0.3} direction="down" className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"><span /></ParallaxFloat>
        <ParallaxFloat speed={0.4} direction="up" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[100px]"><span /></ParallaxFloat>
      </div>

      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Headline — word by word reveal */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-cream overflow-hidden block">
            {dict.hero.headlineTop.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 80, rotateX: 40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4 + i * 0.1,
                  ease: [0.25, 0.4, 0, 1],
                }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </span>
          <span className="gradient-text overflow-hidden block">
            {dict.hero.headlineBottom.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 80, rotateX: 40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7 + i * 0.1,
                  ease: [0.25, 0.4, 0, 1],
                }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="max-w-2xl mx-auto text-lg sm:text-xl text-cream/80 leading-relaxed mb-10"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.4, 0, 1] }}
        >
          {dict.hero.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <MagneticButton
            onClick={open}
            className="group inline-flex btn-primary"
          >
            {dict.hero.ctaPrimary}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform"
            />
          </MagneticButton>
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex btn-secondary"
          >
            <Play size={18} className="text-primary" />
            {dict.hero.ctaSecondary}
          </Link>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 2, duration: 0.5 },
          y: { delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-cream/20 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
