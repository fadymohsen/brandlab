"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, LogOut, X, Save, Film, Scissors, Lightbulb, Monitor, Music, Sparkles } from "lucide-react";

const ICON_OPTIONS = [
  { value: "Film", label: "Film", Icon: Film },
  { value: "Scissors", label: "Scissors", Icon: Scissors },
  { value: "Lightbulb", label: "Lightbulb", Icon: Lightbulb },
  { value: "Monitor", label: "Monitor", Icon: Monitor },
  { value: "Music", label: "Music", Icon: Music },
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
];

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Film, Scissors, Lightbulb, Monitor, Music, Sparkles,
};

interface Service {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  detailedEn: string;
  detailedAr: string;
  icon: string;
  sortOrder: number;
}

const emptyForm = { titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", detailedEn: "", detailedAr: "", icon: "Film", sortOrder: 0 };

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const router = useRouter();

  async function fetchItems() {
    const res = await fetch("/api/services");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, sortOrder: items.length });
    setShowForm(true);
  }

  function openEdit(item: Service) {
    setEditing(item);
    setForm({
      titleEn: item.titleEn, titleAr: item.titleAr,
      descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
      detailedEn: item.detailedEn, detailedAr: item.detailedAr,
      icon: item.icon, sortOrder: item.sortOrder,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editing) {
      const res = await fetch(`/api/services/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing.id ? updated : i)));
      }
    } else {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setItems([...items, created]);
      }
    }

    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
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
          <Link href="/admin/testimonials" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Testimonials</Link>
          <Link href="/admin/services" className="py-3 text-sm text-cream font-medium border-b-2 border-primary whitespace-nowrap">Services</Link>
          <Link href="/admin/plans" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Plans & Pricing</Link>
          <Link href="/admin/coupons" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Coupons</Link>
          <Link href="/admin/orders" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Orders</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cream">Services</h2>
            <p className="text-cream/50 text-sm mt-1">{items.length} services</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Service
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-cream/40">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 mb-4">No services yet</p>
            <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white">
              <Plus size={16} /> Add Your First Service
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const IconComp = iconMap[item.icon] || Film;
              return (
                <div key={item.id} className="gradient-border p-5 flex items-center gap-4">
                  <div className="relative z-10 flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                      <IconComp size={24} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-cream text-sm">{item.titleEn}</h3>
                      {item.titleAr && <p className="text-cream/40 text-xs">{item.titleAr}</p>}
                      <p className="text-cream/50 text-xs mt-1 truncate">{item.descriptionEn}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-2 shrink-0">
                    <span className="text-xs text-cream/30 mr-2">#{item.sortOrder}</span>
                    <button onClick={() => openEdit(item)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-primary hover:border-primary/30 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteModal(item.id)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-red-400 hover:border-red-400/30 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-cream">{editing ? "Edit" : "Add"} Service</h3>
              <button onClick={() => setShowForm(false)} className="text-cream/40 hover:text-cream"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Title (EN) *</label>
                  <input type="text" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="Video Editing" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Title (AR)</label>
                  <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="تحرير الفيديو" dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Short Description (EN)</label>
                  <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder="Brief description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Short Description (AR)</label>
                  <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder="وصف مختصر..." dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Detailed Description (EN)</label>
                  <textarea value={form.detailedEn} onChange={(e) => setForm({ ...form, detailedEn: e.target.value })} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder="Full details for services page..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Detailed Description (AR)</label>
                  <textarea value={form.detailedAr} onChange={(e) => setForm({ ...form, detailedAr: e.target.value })} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder="التفاصيل الكاملة..." dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {ICON_OPTIONS.map(({ value, Icon }) => (
                      <button key={value} type="button" onClick={() => setForm({ ...form, icon: value })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${form.icon === value ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-cream/40 hover:text-cream"}`}>
                        <Icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : editing ? "Update Service" : "Add Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteModal(null)}>
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-cream mb-2">Delete Service?</h3>
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
