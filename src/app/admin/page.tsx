"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, LogOut, ExternalLink, Play } from "lucide-react";

interface PortfolioItem {
  id: string;
  youtubeUrl: string;
  createdAt: string;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const router = useRouter();

  async function fetchItems() {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((item) => item.id !== id));
    }
    setDeleteModal(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
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
              <h1 className="text-lg font-bold text-cream">Admin Panel</h1>
              <p className="text-xs text-cream/40">Brand Lab</p>
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
        <div className="max-w-6xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <Link href="/admin" className="py-3 text-sm text-cream font-medium border-b-2 border-primary whitespace-nowrap">
            Portfolio
          </Link>
          <Link href="/admin/testimonials" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">
            Testimonials
          </Link>
          <Link href="/admin/services" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">
            Services
          </Link>
          <Link href="/admin/plans" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">
            Plans & Pricing
          </Link>
          <Link href="/admin/coupons" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">
            Coupons
          </Link>
          <Link href="/admin/orders" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">
            Orders
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cream">Portfolio Items</h2>
            <p className="text-cream/50 text-sm mt-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/admin/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add New
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-cream/40">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 mb-4">No portfolio items yet</p>
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Add Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => {
              const ytId = extractYoutubeId(item.youtubeUrl);
              const isPlaying = playingId === item.id;

              return (
                <div key={item.id} className="gradient-border overflow-hidden">
                  <div className="relative z-10">
                    {/* Video Preview */}
                    <div className="relative aspect-[9/16] max-h-[400px] bg-black/50">
                      {isPlaying && ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1`}
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <>
                          {ytId && (
                            <Image
                              src={`https://img.youtube.com/vi/${ytId}/0.jpg`}
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                            />
                          )}
                          <button
                            onClick={() => setPlayingId(item.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                              <Play size={24} className="text-white ml-1" />
                            </div>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Info & Actions */}
                    <div className="p-4">
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cream/40 hover:text-primary transition-colors flex items-center gap-1 truncate mb-3"
                      >
                        {item.youtubeUrl}
                        <ExternalLink size={10} />
                      </a>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/edit/${item.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-cream/50 hover:text-primary hover:border-primary/30 transition-colors text-xs"
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal(item.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-cream/50 hover:text-red-400 hover:border-red-400/30 transition-colors text-xs"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteModal(null)}>
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-cream mb-2">Delete Item?</h3>
            <p className="text-cream/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-cream/70 hover:text-cream text-sm transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteModal)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
