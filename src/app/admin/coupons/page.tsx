"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, LogOut, ToggleLeft, ToggleRight, Tag } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency: string;
  targetPlan: string;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchCoupons() {
    const res = await fetch("/api/coupons");
    if (res.ok) {
      const data = await res.json();
      setCoupons(data.coupons);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  }

  async function handleToggle(coupon: Coupon) {
    const res = await fetch(`/api/coupons/${coupon.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    if (res.ok) {
      setCoupons(
        coupons.map((c) =>
          c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
        )
      );
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function formatDiscount(coupon: Coupon) {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }
    return coupon.currency === "EGP"
      ? `${coupon.discountValue} EGP`
      : `$${coupon.discountValue}`;
  }

  function isExpired(coupon: Coupon) {
    return coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 bg-dark/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Brand Lab"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h1 className="text-lg font-bold text-cream">Admin Dashboard</h1>
              <p className="text-xs text-cream/40">Brand Lab Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b border-white/5 bg-dark/40">
        <div className="max-w-6xl mx-auto px-6 flex gap-6">
          <Link
            href="/admin"
            className="py-3 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/admin/coupons"
            className="py-3 text-sm text-cream font-medium border-b-2 border-primary"
          >
            Coupons
          </Link>
          <Link
            href="/admin/orders"
            className="py-3 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            Orders
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cream">Coupons</h2>
            <p className="text-cream/50 text-sm mt-1">
              {coupons.length} {coupons.length === 1 ? "coupon" : "coupons"}
            </p>
          </div>
          <Link
            href="/admin/coupons/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add New
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-cream/40">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="mx-auto text-cream/20 mb-4" />
            <p className="text-cream/40 mb-4">No coupons yet</p>
            <Link
              href="/admin/coupons/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Create Your First Coupon
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="gradient-border p-5 flex items-center justify-between gap-4"
              >
                <div className="relative z-10 flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-lg font-bold text-cream">
                      {coupon.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {formatDiscount(coupon)}
                    </span>
                    {coupon.targetPlan !== "all" && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent capitalize">
                        {coupon.targetPlan}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-cream/40">
                    <span className="flex items-center gap-1.5">
                      {coupon.isActive && !isExpired(coupon) ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      )}
                      {isExpired(coupon)
                        ? "Expired"
                        : coupon.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                    <span>
                      {coupon.currentUses}/{coupon.maxUses ?? "unlimited"} used
                    </span>
                    {coupon.expiresAt && (
                      <span>
                        Expires{" "}
                        {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(coupon)}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-primary hover:border-primary/30 transition-colors"
                    title={coupon.isActive ? "Disable" : "Enable"}
                  >
                    {coupon.isActive ? (
                      <ToggleRight size={14} />
                    ) : (
                      <ToggleLeft size={14} />
                    )}
                  </button>
                  <Link
                    href={`/admin/coupons/edit/${coupon.id}`}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
