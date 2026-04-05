"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo.jpg"
            alt="Brand Lab"
            width={64}
            height={64}
            className="rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-cream">Admin Panel</h1>
          <p className="text-cream/50 text-sm mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="gradient-border p-6">
          <div className="relative z-10 space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-xs mt-1.5">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
