"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, LogOut, Star, X, Save, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 5 });
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const router = useRouter();

  async function fetchItems() {
    const res = await fetch("/api/testimonials");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ name: "", role: "", content: "", rating: 5 });
    setShowForm(true);
  }

  function openEdit(item: Testimonial) {
    setEditing(item);
    setForm({ name: item.name, role: item.role, content: item.content, rating: item.rating });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editing) {
      const res = await fetch(`/api/testimonials/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing.id ? updated : i)));
      }
    } else {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setItems([created, ...items]);
      }
    }

    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
    setDeleteModal(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-dark/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Brand Lab" width={40} height={40} className="rounded-full" />
            <div>
              <h1 className="text-lg font-bold text-cream">Admin Panel</h1>
              <p className="text-xs text-cream/40">Brand Lab</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <nav className="border-b border-white/5 bg-dark/40">
        <div className="max-w-6xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <Link href="/admin" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Portfolio</Link>
          <Link href="/admin/testimonials" className="py-3 text-sm text-cream font-medium border-b-2 border-primary whitespace-nowrap">Testimonials</Link>
          <Link href="/admin/services" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Services</Link>
          <Link href="/admin/plans" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Plans & Pricing</Link>
          <Link href="/admin/coupons" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Coupons</Link>
          <Link href="/admin/orders" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Orders</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cream">Testimonials</h2>
            <p className="text-cream/50 text-sm mt-1">{items.length} testimonials</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add New
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-cream/40">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 mb-4">No testimonials yet</p>
            <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white">
              <Plus size={16} /> Add Your First Testimonial
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <div key={item.id} className="gradient-border p-6">
                <div className="relative z-10">
                  <Quote size={24} className="text-primary/30 mb-3" />
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-cream/20"} />
                    ))}
                  </div>
                  <p className="text-cream/70 text-sm leading-relaxed mb-4">&ldquo;{item.content}&rdquo;</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-cream text-sm">{item.name}</div>
                      <div className="text-xs text-cream/50">{item.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-cream/50 hover:text-primary hover:border-primary/30 transition-colors text-xs">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteModal(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-cream/50 hover:text-red-400 hover:border-red-400/30 transition-colors text-xs">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-cream">{editing ? "Edit" : "Add"} Testimonial</h3>
              <button onClick={() => setShowForm(false)} className="text-cream/40 hover:text-cream"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">Client Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">Role / Company</label>
                <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="CEO, Company Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">Testimonial *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder="What did the client say..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })} className="p-1">
                      <Star size={24} className={r <= form.rating ? "text-amber-400 fill-amber-400" : "text-cream/20"} />
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : editing ? "Update" : "Add Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteModal(null)}>
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-cream mb-2">Delete Testimonial?</h3>
            <p className="text-cream/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-cream/70 hover:text-cream text-sm transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteModal)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
