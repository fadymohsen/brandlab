"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  MessageCircle,
  Smartphone,
  Receipt,
  CheckCircle,
  ArrowRight,
  Tag,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useRegion } from "@/components/RegionProvider";

export default function PaymentPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const planSlug = params.plan as string;
  const dict = useDictionary();
  const region = useRegion();
  const isRtl = locale === "ar";

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    discountType: "percentage" | "fixed";
    discountValue: number;
    currency: string;
    couponId: string;
    code: string;
  } | null>(null);

  const plan = dict.pricing.plans.find(
    (p: { slug: string }) => p.slug === planSlug
  );

  if (!plan) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-cream">
            {dict.payment.planNotFound}
          </h1>
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex btn-primary"
          >
            {dict.payment.backToPricing}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const price = plan.price[region];
  const currency = region === "EG" ? "EGP" : "USD";
  const rawAmount = plan.priceRaw[region];

  // Calculate discounted amount
  let finalAmount = rawAmount;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      finalAmount = rawAmount - (rawAmount * appliedCoupon.discountValue) / 100;
    } else {
      finalAmount = rawAmount - appliedCoupon.discountValue;
    }
    if (finalAmount < 0) finalAmount = 0;
  }

  const hasDiscount = appliedCoupon && finalAmount !== rawAmount;

  const amountText =
    region === "EG"
      ? `${Math.round(finalAmount).toLocaleString()} EGP`
      : `$${Math.round(finalAmount)}`;

  const originalAmountText =
    region === "EG"
      ? `${rawAmount.toLocaleString()} EGP`
      : `$${rawAmount}`;

  const displayPrice = hasDiscount
    ? region === "EG"
      ? `${Math.round(finalAmount).toLocaleString()} EGP`
      : `$${Math.round(finalAmount)}`
    : price;

  const stepDescription = dict.payment.whatsappPayment.steps[0].description.replace(
    "{amount}",
    amountText
  );

  const couponNote = appliedCoupon ? ` (Coupon: ${appliedCoupon.code})` : "";
  const whatsappMessage = encodeURIComponent(
    region === "EG"
      ? `مرحباً، أريد الاشتراك في خطة ${plan.name} (${amountText}).${appliedCoupon ? ` كوبون: ${appliedCoupon.code}` : ""} أرسلت المبلغ وأريد تأكيد الاشتراك.`
      : `Hi, I want to subscribe to the ${plan.name} plan (${amountText}).${couponNote} I've sent the payment and would like to confirm my subscription.`
  );

  const stepIcons = [
    <Smartphone key="send" size={24} />,
    <Receipt key="receipt" size={24} />,
    <CheckCircle key="check" size={24} />,
  ];

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          planSlug,
          currency,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          discountType: data.discountType,
          discountValue: data.discountValue,
          currency: data.currency,
          couponId: data.couponId,
          code: couponCode.toUpperCase(),
        });
        setCouponError("");
      } else {
        const errorKey = data.error as keyof typeof dict.coupon;
        setCouponError(dict.coupon[errorKey] || dict.coupon.invalidCode);
      }
    } catch {
      setCouponError(dict.coupon.invalidCode);
    }

    setCouponLoading(false);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-primary transition-colors mb-8"
          >
            {isRtl ? (
              <ArrowRight size={16} />
            ) : (
              <ArrowLeft size={16} />
            )}
            {dict.payment.backToPricing}
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-cream">
            {dict.payment.title}{" "}
            <span className="gradient-text">{plan.name}</span>
          </h1>
          <div className="mt-6">
            {hasDiscount ? (
              <>
                <span className="text-2xl text-cream/40 line-through me-3">
                  {price}
                </span>
                <span className="text-5xl font-bold gradient-text">
                  {displayPrice}
                </span>
              </>
            ) : (
              <span className="text-5xl font-bold gradient-text">{price}</span>
            )}
            <span className="text-cream/60 text-lg ms-2">
              {dict.payment.perMonth}
            </span>
          </div>
          {hasDiscount && (
            <p className="mt-2 text-green-400 text-sm font-medium">
              {dict.coupon.discount}:{" "}
              {appliedCoupon!.discountType === "percentage"
                ? `${appliedCoupon!.discountValue}%`
                : `${appliedCoupon!.currency === "EGP" ? "" : "$"}${appliedCoupon!.discountValue}${appliedCoupon!.currency === "EGP" ? " EGP" : ""}`}
            </p>
          )}
          <p className="mt-4 text-cream/70 text-lg">
            {dict.payment.subtitle}
          </p>
        </div>
      </section>

      {/* Coupon Input */}
      <section className="pb-8">
        <div className="max-w-md mx-auto px-6 lg:px-8">
          {appliedCoupon ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  {dict.coupon.valid}
                </span>
                <span className="font-mono text-sm text-cream font-bold">
                  {appliedCoupon.code}
                </span>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-cream/40 hover:text-cream transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag
                    size={16}
                    className="absolute start-4 top-1/2 -translate-y-1/2 text-cream/30"
                  />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    placeholder={dict.coupon.placeholder}
                    className="w-full ps-10 pe-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
                >
                  {couponLoading ? dict.coupon.applying : dict.coupon.apply}
                </button>
              </div>
              {couponError && (
                <p className="text-red-400 text-xs mt-2">{couponError}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Payment Options */}
      <section className="pt-12 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Online Payment */}
            <div className="rounded-2xl bg-gradient-to-b from-primary/10 to-secondary/5 border border-primary/20 p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <CreditCard size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-cream">
                  {dict.payment.onlinePayment.title}
                </h2>
              </div>
              <p className="text-cream/60 text-sm mb-8">
                {dict.payment.onlinePayment.subtitle}
              </p>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-center mb-8">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {["Visa", "Mastercard", "Fawry", "Wallet", "Apple Pay"].map(
                      (method) => (
                        <div
                          key={method}
                          className="px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-cream/70 text-base font-medium"
                        >
                          {method}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <button className="flex w-full btn-primary">
                  {dict.payment.onlinePayment.button}
                  {isRtl ? (
                    <ArrowLeft size={16} />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* WhatsApp Payment */}
            <div className="rounded-2xl gradient-border p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle size={24} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-cream">
                  {dict.payment.whatsappPayment.title}
                </h2>
              </div>

              <div className="flex-1 mt-6">
                <div className="space-y-6">
                  {dict.payment.whatsappPayment.steps.map(
                    (
                      step: {
                        title: string;
                        description: string;
                        phone?: string;
                      },
                      index: number
                    ) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                          {stepIcons[index]}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            {step.title}
                          </h3>
                          <p className="text-cream/60 text-sm mt-1">
                            {index === 0 ? stepDescription : step.description}
                          </p>
                          {step.phone && (
                            <a
                              href={`tel:${step.phone.replace(/\s/g, "")}`}
                              className="text-primary font-semibold mt-1 inline-block hover:underline"
                              dir="ltr"
                            >
                              {step.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <a
                href={`https://wa.me/201227742865?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full btn-secondary mt-8 !border-green-500/30 hover:!bg-green-500/10"
              >
                {dict.payment.whatsappPayment.button}
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
