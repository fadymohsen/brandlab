"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ArrowRight } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useLeadPopup } from "./LeadPopupProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dict = useDictionary();
  const { open: openPopup } = useLeadPopup();
  const pathname = usePathname();

  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en";
  const switchLocale = currentLocale === "en" ? "ar" : "en";
  const switchPath = pathname.replace(/^\/(en|ar)/, `/${switchLocale}`);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: dict.nav.home, href: `/${currentLocale}` },
    { label: dict.nav.about, href: `/${currentLocale}/about` },
    { label: dict.nav.services, href: `/${currentLocale}/services` },
    { label: dict.nav.portfolio, href: `/${currentLocale}/portfolio` },
    { label: dict.nav.pricing, href: `/${currentLocale}/pricing` },
    { label: dict.nav.contact, href: `/${currentLocale}/contact` },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo — Left */}
            <Link
              href={`/${currentLocale}`}
              onClick={(e) => {
                const isHome = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
                if (isHome) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center gap-3 relative z-60 shrink-0"
            >
              <Image
                src="/logo.jpg"
                alt="Brand Lab"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="text-xl font-bold tracking-tight text-cream">
                Brand <span className="gradient-text">Lab</span>
              </span>
            </Link>

            {/* Center — Nav Links + Lang */}
            <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-cream/70 hover:text-cream transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}

              {/* Language Switcher */}
              <Link
                href={switchPath}
                className="flex items-center gap-1.5 text-sm font-medium text-cream/70 hover:text-cream transition-colors"
              >
                <Globe size={16} />
                {currentLocale === "en" ? "العربية" : "English"}
              </Link>
            </div>

            {/* Right — CTA */}
            <button
              onClick={openPopup}
              className="hidden lg:flex btn-primary px-6 py-2.5 text-sm shrink-0"
            >
              {dict.nav.cta}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-cream relative z-60 w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark/95 backdrop-blur-2xl"
          onClick={() => setIsOpen(false)}
        />

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 end-6 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream hover:text-primary hover:border-primary/30 transition-colors"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        {/* Menu Content */}
        <div className="relative z-10 flex flex-col h-full pt-20 pb-10 px-8">
          {/* Nav Links */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between py-4 border-b border-white/5 transition-all duration-500 ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: isOpen ? `${index * 60}ms` : "0ms" }}
              >
                <span className="text-2xl font-semibold text-cream/80 group-hover:text-cream group-hover:gradient-text transition-colors">
                  {link.label}
                </span>
                <ArrowRight
                  size={20}
                  className="text-cream/20 group-hover:text-primary rtl:rotate-180 transition-colors"
                />
              </a>
            ))}
          </div>

          {/* Bottom Section */}
          <div
            className={`space-y-6 transition-all duration-500 ${
              isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "450ms" : "0ms" }}
          >
            {/* Language Switcher */}
            <Link
              href={switchPath}
              onClick={() => setIsOpen(false)}
              className="flex btn-secondary w-full rounded-xl py-3"
            >
              <Globe size={18} />
              {currentLocale === "en" ? "العربية" : "English"}
            </Link>

            {/* CTA */}
            <button
              onClick={() => { setIsOpen(false); openPopup(); }}
              className="flex btn-primary w-full rounded-xl"
            >
              {dict.nav.cta}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
