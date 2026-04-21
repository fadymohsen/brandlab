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
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-dark/40" />

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
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.3] mb-6">
          <span className="text-cream block py-2">
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
          <motion.span
            className="gradient-text block py-2"
            initial={{ opacity: 0, y: 80, rotateX: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              textShadow: [
                "0 0 0px rgba(124,58,237,0)",
                "0 0 30px rgba(124,58,237,0.6)",
                "0 0 0px rgba(124,58,237,0)",
              ],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.7 },
              y: { duration: 0.8, delay: 0.7 },
              rotateX: { duration: 0.8, delay: 0.7 },
              textShadow: { duration: 2, delay: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {dict.hero.headlineBottom}
          </motion.span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="max-w-2xl mx-auto text-lg sm:text-xl text-cream leading-relaxed mb-10"
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

    </section>
  );
}
