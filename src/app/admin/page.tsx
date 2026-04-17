"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink, Play } from "lucide-react";
import AdminHeader from "./AdminHeader";

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
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen">
      <AdminHeader activeTab="portfolio" />

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item, index) => {
              const ytId = extractYoutubeId(item.youtubeUrl);

              return (
                <div key={item.id} className="group rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  {/* Video Embed */}
                  <div className="relative aspect-[9/16] bg-black">
                    {ytId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&showinfo=0&controls=1`}
                        className="absolute inset-0 w-full h-full rounded-t-2xl"
                        allow="encrypted-media; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-cream/20 gap-3">
                        <Play size={40} />
                        <span className="text-xs">No preview</span>
                      </div>
                    )}
                    {/* Index badge */}
                    <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[11px] font-bold text-cream/70">
                      {index + 1}
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="p-3 flex items-center gap-2">
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 text-[11px] text-cream/30 hover:text-primary transition-colors truncate flex items-center gap-1"
                    >
                      <ExternalLink size={9} className="shrink-0" />
                      <span className="truncate">{item.youtubeUrl.replace(/https?:\/\/(www\.)?/, '')}</span>
                    </a>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/admin/edit/${item.id}`}
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cream/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => setDeleteModal(item.id)}
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cream/40 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
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
