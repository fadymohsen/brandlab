"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewCouponPage() {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [targetPlan, setTargetPlan] = useState("all");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Coupon code is required");
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      setError("Discount value must be greater than 0");
      return;
    }
    if (discountType === "percentage" && Number(discountValue) > 100) {
      setError("Percentage discount cannot exceed 100%");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discountType,
          discountValue: Number(discountValue),
          currency: discountType === "fixed" ? currency : "USD",
          targetPlan,
          maxUses: maxUses ? Number(maxUses) : null,
          expiresAt: expiresAt || null,
        }),
      });

      if (res.ok) {
        router.push("/admin/coupons");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error: " + String(err));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-dark/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link
            href="/admin/coupons"
            className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Coupons
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-cream mb-8">Create Coupon</h2>

        <form onSubmit={handleSubmit} className="gradient-border p-8">
          <div className="relative z-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Coupon Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE20"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">
                  Discount Type *
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">
                  Discount Value *
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 500"}
                  min="1"
                  max={discountType === "percentage" ? "100" : undefined}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {discountType === "fixed" && (
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EGP">EGP (Egyptian Pound)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Target Plan
              </label>
              <select
                value={targetPlan}
                onChange={(e) => setTargetPlan(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
