"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, LogOut, X, Save, Star, Check } from "lucide-react";

interface Plan {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  priceEg: string;
  priceInt: string;
  priceRawEg: number;
  priceRawInt: number;
  period: string;
  featuresEn: string;
  featuresAr: string;
  isFeatured: boolean;
  sortOrder: number;
}

const emptyForm = {
  nameEn: "", nameAr: "", slug: "", descriptionEn: "", descriptionAr: "",
  priceEg: "", priceInt: "", priceRawEg: 0, priceRawInt: 0, period: "month",
  featuresEn: "", featuresAr: "", isFeatured: false, sortOrder: 0,
};

export default function PlansPage() {
  const [items, setItems] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const router = useRouter();

  async function fetchItems() {
    const res = await fetch("/api/plans");
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

  function openEdit(item: Plan) {
    setEditing(item);
    setForm({
      nameEn: item.nameEn, nameAr: item.nameAr, slug: item.slug,
      descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
      priceEg: item.priceEg, priceInt: item.priceInt,
      priceRawEg: item.priceRawEg, priceRawInt: item.priceRawInt,
      period: item.period, featuresEn: item.featuresEn, featuresAr: item.featuresAr,
      isFeatured: item.isFeatured, sortOrder: item.sortOrder,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editing) {
      const res = await fetch(`/api/plans/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing.id ? updated : i)));
      }
    } else {
      const res = await fetch("/api/plans", {
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
    const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
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
          <Link href="/admin/services" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Services</Link>
          <Link href="/admin/plans" className="py-3 text-sm text-cream font-medium border-b-2 border-primary whitespace-nowrap">Plans & Pricing</Link>
          <Link href="/admin/coupons" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Coupons</Link>
          <Link href="/admin/orders" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Orders</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cream">Plans & Pricing</h2>
            <p className="text-cream/50 text-sm mt-1">{items.length} plans</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Plan
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-cream/40">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 mb-4">No plans yet</p>
            <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white">
              <Plus size={16} /> Add Your First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div key={item.id} className={`gradient-border p-6 ${item.isFeatured ? "ring-2 ring-primary/30" : ""}`}>
                <div className="relative z-10 flex flex-col h-full">
                  {item.isFeatured && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">Featured</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-cream">{item.nameEn}</h3>
                  {item.nameAr && <p className="text-cream/40 text-sm" dir="rtl">{item.nameAr}</p>}
                  <p className="text-cream/50 text-xs mt-1 mb-3">{item.descriptionEn}</p>

                  <div className="flex gap-4 mb-4">
                    <div>
                      <span className="text-2xl font-bold gradient-text">{item.priceEg}</span>
                      <span className="text-cream/40 text-xs ml-1">EGP/{item.period}</span>
                    </div>
                    <div className="border-l border-white/10 pl-4">
                      <span className="text-2xl font-bold gradient-text">{item.priceInt}</span>
                      <span className="text-cream/40 text-xs ml-1">USD/{item.period}</span>
                    </div>
                  </div>

                  {item.featuresEn && (
                    <ul className="space-y-1.5 mb-4">
                      {item.featuresEn.split("\n").filter(Boolean).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-cream/60">
                          <Check size={12} className="text-primary mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2 mt-auto pt-4">
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
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-cream">{editing ? "Edit" : "Add"} Plan</h3>
              <button onClick={() => setShowForm(false)} className="text-cream/40 hover:text-cream"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Name (EN) *</label>
                  <input type="text" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="Pro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Name (AR)</label>
                  <input type="text" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="احترافي" dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Slug *</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="pro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Period</label>
                  <input type="text" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="month" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Description (EN)</label>
                  <input type="text" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="For brands ready to grow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Description (AR)</label>
                  <input type="text" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="للعلامات التجارية" dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Price Display (EG)</label>
                  <input type="text" value={form.priceEg} onChange={(e) => setForm({ ...form, priceEg: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="6,000 EGP" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Price Display (INT)</label>
                  <input type="text" value={form.priceInt} onChange={(e) => setForm({ ...form, priceInt: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50" placeholder="$199" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Raw Price EG (for payment)</label>
                  <input type="number" value={form.priceRawEg} onChange={(e) => setForm({ ...form, priceRawEg: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Raw Price INT (for payment)</label>
                  <input type="number" value={form.priceRawInt} onChange={(e) => setForm({ ...form, priceRawInt: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream focus:outline-none focus:border-primary/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Features (EN) <span className="text-cream/40 font-normal">one per line</span></label>
                  <textarea value={form.featuresEn} onChange={(e) => setForm({ ...form, featuresEn: e.target.value })} rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder={"10 reels/month\nAdvanced editing\nDedicated editor"} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-1.5">Features (AR) <span className="text-cream/40 font-normal">one per line</span></label>
                  <textarea value={form.featuresAr} onChange={(e) => setForm({ ...form, featuresAr: e.target.value })} rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 resize-none" placeholder={"١٠ ريلز/شهر\nمونتاج متقدم"} dir="rtl" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm text-cream/70">Mark as Featured / Most Popular</span>
                </label>
                <div className="ml-auto">
                  <label className="text-sm text-cream/70 mr-2">Order:</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-cream text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : editing ? "Update Plan" : "Add Plan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteModal(null)}>
          <div className="bg-dark-light border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-cream mb-2">Delete Plan?</h3>
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
