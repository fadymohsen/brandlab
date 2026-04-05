"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewPortfolioItem() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !youtubeUrl.trim()) {
      setError("Title and YouTube URL are required");
      return;
    }

    if (
      !youtubeUrl.match(
        /youtube\.com\/(shorts|watch|embed)|youtu\.be\//
      )
    ) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, youtubeUrl, description }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
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
        <h2 className="text-2xl font-bold text-cream mb-8">Add Portfolio Item</h2>

        <form onSubmit={handleSubmit} className="gradient-border p-8">
          <div className="relative z-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fitness Brand Campaign"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Brand Film, Reel, Montage"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                YouTube Shorts URL *
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/shorts/VIDEO_ID"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of this project..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
