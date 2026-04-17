"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

interface Order {
  id: string;
  invoiceId: string | null;
  invoiceKey: string | null;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  couponCode: string | null;
  paymentUrl: string | null;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/orders/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setOrders(orders.filter((o) => o.id !== deleteId));
    }
    setDeleteId(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  const totalRevenueEGP = orders
    .filter((o) => o.status === "paid" && o.currency === "EGP")
    .reduce((sum, o) => sum + o.amount, 0);

  const totalRevenueUSD = orders
    .filter((o) => o.status === "paid" && o.currency === "USD")
    .reduce((sum, o) => sum + o.amount, 0);

  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const failedCount = orders.filter((o) => o.status === "failed").length;

  function formatAmount(amount: number, currency: string) {
    return currency === "EGP"
      ? `${Math.round(amount).toLocaleString()} EGP`
      : `$${Math.round(amount)}`;
  }

  function statusBadge(status: string) {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
            <CheckCircle size={12} />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">
            <Clock size={12} />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
            <XCircle size={12} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-cream/50">
            {status}
          </span>
        );
    }
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
              <h1 className="text-lg font-bold text-cream">Admin Dashboard</h1>
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

      {/* Nav */}
      <nav className="border-b border-white/5 bg-dark/40">
        <div className="max-w-6xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <Link href="/admin" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Portfolio</Link>
          <Link href="/admin/testimonials" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Testimonials</Link>
          <Link href="/admin/services" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Services</Link>
          <Link href="/admin/plans" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Plans & Pricing</Link>
          <Link href="/admin/coupons" className="py-3 text-sm text-cream/50 hover:text-cream transition-colors whitespace-nowrap">Coupons</Link>
          <Link href="/admin/orders" className="py-3 text-sm text-cream font-medium border-b-2 border-primary whitespace-nowrap">Orders</Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cream/40 text-xs mb-2">
              <ShoppingCart size={14} />
              Total Orders
            </div>
            <p className="text-2xl font-bold text-cream">{orders.length}</p>
          </div>
          <div className="rounded-xl bg-green-500/5 border border-green-500/15 p-5">
            <div className="flex items-center gap-2 text-green-400/60 text-xs mb-2">
              <DollarSign size={14} />
              Revenue
            </div>
            <div>
              {totalRevenueEGP > 0 && (
                <p className="text-xl font-bold text-green-400">
                  {Math.round(totalRevenueEGP).toLocaleString()} EGP
                </p>
              )}
              {totalRevenueUSD > 0 && (
                <p className="text-xl font-bold text-green-400">
                  ${Math.round(totalRevenueUSD)}
                </p>
              )}
              {totalRevenue === 0 && (
                <p className="text-xl font-bold text-green-400">0</p>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-cream/40 text-xs mb-2">
              <Users size={14} />
              Paid
            </div>
            <p className="text-2xl font-bold text-cream">{paidCount}</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
            <div className="flex items-center gap-2 text-yellow-400/60 text-xs mb-2">
              <Clock size={14} />
              Pending
            </div>
            <p className="text-2xl font-bold text-cream">{pendingCount}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-cream">Orders</h2>
          <p className="text-cream/50 text-sm mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-cream/40">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={48} className="mx-auto text-cream/20 mb-4" />
            <p className="text-cream/40">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="gradient-border p-5"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Customer + Plan */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-base font-bold text-cream">
                        {order.customerName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                        {order.planName}
                      </span>
                      {statusBadge(order.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cream/40">
                      <a
                        href={`mailto:${order.customerEmail}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Mail size={11} />
                        {order.customerEmail}
                      </a>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        dir="ltr"
                      >
                        <Phone size={11} />
                        {order.customerPhone}
                      </a>
                      {order.couponCode && (
                        <span className="text-accent">
                          Coupon: {order.couponCode}
                        </span>
                      )}
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right: Amount + Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-lg font-bold text-cream">
                      {formatAmount(order.amount, order.currency)}
                    </span>
                    {order.paymentUrl && (
                      <a
                        href={order.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-primary hover:border-primary/30 transition-colors"
                        title="View Invoice"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteId(order.id)}
                      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-red-400 hover:border-red-400/30 transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#141418] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 size={24} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-cream text-center mb-2">
              Delete Order
            </h3>
            <p className="text-cream/50 text-sm text-center mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-cream/70 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
