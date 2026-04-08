"use client";

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
  const amountText =
    region === "EG"
      ? `${rawAmount.toLocaleString()} EGP`
      : `$${rawAmount}`;

  const stepDescription = dict.payment.whatsappPayment.steps[0].description.replace(
    "{amount}",
    amountText
  );

  const whatsappMessage = encodeURIComponent(
    region === "EG"
      ? `مرحباً، أريد الاشتراك في خطة ${plan.name} (${price}). أرسلت المبلغ وأريد تأكيد الاشتراك.`
      : `Hi, I want to subscribe to the ${plan.name} plan (${price}). I've sent the payment and would like to confirm my subscription.`
  );

  const stepIcons = [
    <Smartphone key="send" size={24} />,
    <Receipt key="receipt" size={24} />,
    <CheckCircle key="check" size={24} />,
  ];

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
            <span className="text-5xl font-bold gradient-text">{price}</span>
            <span className="text-cream/60 text-lg ms-2">
              {dict.payment.perMonth}
            </span>
          </div>
          <p className="mt-4 text-cream/70 text-lg">
            {dict.payment.subtitle}
          </p>
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
