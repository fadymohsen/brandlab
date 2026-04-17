"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Database } from "lucide-react";

interface AdminHeaderProps {
  activeTab: string;
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const router = useRouter();

  async function handleSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedResult(data.results.join(" | "));
      } else {
        setSeedResult("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setSeedResult("Network error: " + String(err));
    }
    setSeeding(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const tabs = [
    { id: "portfolio", label: "Portfolio", href: "/admin" },
    { id: "testimonials", label: "Testimonials", href: "/admin/testimonials" },
    { id: "services", label: "Services", href: "/admin/services" },
    { id: "plans", label: "Plans & Pricing", href: "/admin/plans" },
    { id: "coupons", label: "Coupons", href: "/admin/coupons" },
    { id: "orders", label: "Orders", href: "/admin/orders" },
  ];

  return (
    <>
      <header className="border-b border-white/5 bg-dark/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Brand Lab" width={40} height={40} className="rounded-full" />
            <div>
              <h1 className="text-lg font-bold text-cream">Admin Panel</h1>
              <p className="text-xs text-cream/40">Brand Lab</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-cream/50 hover:text-cream hover:border-primary/30 transition-colors disabled:opacity-50"
            >
              <Database size={13} />
              {seeding ? "Seeding..." : "Seed Data"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/5 bg-dark/40">
        <div className="max-w-6xl mx-auto px-6 flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`py-3 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-cream font-medium border-b-2 border-primary"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      {seedResult && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-cream/80">
            {seedResult}
          </div>
        </div>
      )}
    </>
  );
}
