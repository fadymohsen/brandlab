import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  { label: "Ig", href: "#", name: "Instagram" },
  { label: "Yt", href: "#", name: "YouTube" },
  { label: "X", href: "#", name: "Twitter" },
  { label: "In", href: "#", name: "LinkedIn" },
];

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Video Editing", href: "#services" },
      { label: "Montage & Reels", href: "#services" },
      { label: "Color Grading", href: "#services" },
      { label: "Motion Graphics", href: "#services" },
      { label: "Sound Design", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-6">
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
            </a>
            <p className="text-cream/50 leading-relaxed max-w-sm mb-6">
              Where creativity meets precision. We help brands and creators
              craft compelling visual stories that captivate audiences worldwide.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-primary hover:border-primary/30 transition-colors text-xs font-bold"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-cream mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-cream/50 hover:text-cream transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/30">
            &copy; {new Date().getFullYear()} Brand Lab. All rights reserved.
          </p>
          <p className="text-sm text-cream/30">
            Crafted with passion for visual storytelling.
          </p>
        </div>
      </div>
    </footer>
  );
}
