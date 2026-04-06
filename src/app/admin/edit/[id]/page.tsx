"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditPortfolioItem() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        const item = data.items.find(
          (i: { id: string }) => i.id === id
        );
        if (item) {
          setYoutubeUrl(item.youtubeUrl);
        }
      }
      setFetching(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!youtubeUrl.trim()) {
      setError("YouTube Short URL is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "", category: "", youtubeUrl, description: "" }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error: " + String(err));
    }
    setLoading(false);
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cream/40">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-dark/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-cream mb-8">Edit Portfolio Item</h2>

        <form onSubmit={handleSubmit} className="gradient-border p-8">
          <div className="relative z-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                YouTube Short URL *
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Update Item"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
