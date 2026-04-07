"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, X } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";

export default function CookieConsent() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-dark-light border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-cream text-sm mb-1">
              {dict.cookieConsent.title}
            </h3>
            <p className="text-cream/50 text-xs leading-relaxed">
              {dict.cookieConsent.message}{" "}
              <Link
                href={`/${locale}/privacy`}
                className="text-primary hover:text-primary-light transition-colors underline underline-offset-2"
              >
                {dict.cookieConsent.learnMore}
              </Link>
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={accept}
                className="px-5 py-2 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                {dict.cookieConsent.accept}
              </button>
              <button
                onClick={decline}
                className="px-5 py-2 text-xs font-semibold text-cream/60 rounded-lg border border-white/10 hover:text-cream hover:border-white/20 transition-colors"
              >
                {dict.cookieConsent.decline}
              </button>
            </div>
          </div>
          <button
            onClick={decline}
            className="text-cream/30 hover:text-cream/60 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
