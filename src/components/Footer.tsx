"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";

const socialLinks = [
  { label: "Fb", href: "https://www.facebook.com/share/18V8EyMqVJ/?mibextid=wwXIfr", name: "Facebook" },
  { label: "Ig", href: "https://www.instagram.com/brand_lab.agency?igsh=NGhibm5idnFpYzJh", name: "Instagram" },
];

const companyHrefs = ["/about", "/portfolio", "/pricing", "/contact"];
const resourceHrefs = ["/faq", "/privacy", "/terms", "/refund"];

export default function Footer() {
  const dict = useDictionary();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  const footerSections = [
    {
      title: dict.footer.companyTitle,
      links: dict.footer.company.map((label, i) => ({
        label,
        href: `/${locale}${companyHrefs[i]}`,
      })),
    },
    {
      title: dict.footer.resourcesTitle,
      links: dict.footer.resources.map((label, i) => ({
        label,
        href: `/${locale}${resourceHrefs[i]}`,
      })),
    },
  ];

  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.jpg"
                alt="Brand Lab"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-cream">
                Brand <span className="gradient-text">Lab</span>
              </span>
            </Link>
            <p className="text-cream/70 leading-relaxed max-w-sm mb-6">
              {dict.footer.tagline}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-primary hover:border-primary/30 transition-colors text-xs font-bold"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-cream mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 hover:text-cream transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/30">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <p className="text-sm text-cream/30">
            {dict.footer.poweredBy}{" "}
            <a
              href="https://veliq.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              VELIQ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
