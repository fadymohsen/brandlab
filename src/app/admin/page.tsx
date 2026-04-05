"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, LogOut, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  description: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!confirm("Are you sure you want to delete this item?")) return;
    const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((item) => item.id !== id));
    }
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
              <h1 className="text-lg font-bold text-cream">Portfolio Manager</h1>
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
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="gradient-border p-5 flex items-center justify-between gap-4"
              >
                <div className="relative z-10 flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-cream truncate">
                      {item.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream/40 hover:text-primary transition-colors flex items-center gap-1 truncate"
                  >
                    {item.youtubeUrl}
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="relative z-10 flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/edit/${item.id}`}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
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
