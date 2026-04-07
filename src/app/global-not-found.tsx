import "./globals.css";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "404 — Page Not Found | Brand Lab",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={outfit.className}>
      <body className="min-h-screen bg-dark flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/6 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-lg">
          {/* 404 Number */}
          <h1
            className="text-[150px] sm:text-[200px] font-extrabold leading-none select-none"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #E91E8C, #F97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>

          {/* Message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-cream mt-2 mb-4">
            Page Not Found
          </h2>
          <p className="text-cream/50 text-base sm:text-lg leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/en"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #E91E8C, #F97316)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </a>
            <a
              href="/en/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl border transition-all duration-300"
              style={{
                color: "#F5F0E8",
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Contact Us
            </a>
          </div>

          {/* Brand */}
          <p className="mt-16 text-xs text-cream/20">
            &copy; {new Date().getFullYear()} Brand Lab. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}
