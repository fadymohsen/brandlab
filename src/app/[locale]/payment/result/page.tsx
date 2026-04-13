"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDictionary } from "@/i18n/dictionary-provider";

function PaymentResultContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "en";
  const dict = useDictionary();
  const isRtl = locale === "ar";

  const status = searchParams.get("status") || "fail";
  const planName = searchParams.get("plan") || "";

  const configs = {
    success: {
      icon: <CheckCircle size={64} className="text-green-400" />,
      title: dict.paymentResult?.successTitle || "Payment Successful!",
      message:
        (dict.paymentResult?.successMessage || "Your subscription to the {plan} plan has been activated.").replace(
          "{plan}",
          planName
        ),
      bgClass: "from-green-500/10 to-green-500/5",
      borderClass: "border-green-500/20",
    },
    pending: {
      icon: <Clock size={64} className="text-yellow-400" />,
      title: dict.paymentResult?.pendingTitle || "Payment Pending",
      message: dict.paymentResult?.pendingMessage || "Your payment is being processed. We'll notify you once it's confirmed.",
      bgClass: "from-yellow-500/10 to-yellow-500/5",
      borderClass: "border-yellow-500/20",
    },
    fail: {
      icon: <XCircle size={64} className="text-red-400" />,
      title: dict.paymentResult?.failTitle || "Payment Failed",
      message: dict.paymentResult?.failMessage || "Something went wrong with your payment. Please try again.",
      bgClass: "from-red-500/10 to-red-500/5",
      borderClass: "border-red-500/20",
    },
  };

  const config = configs[status as keyof typeof configs] || configs.fail;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        <div
          className={`rounded-2xl bg-gradient-to-b ${config.bgClass} border ${config.borderClass} p-12 backdrop-blur-sm`}
        >
          <div className="flex justify-center mb-6">{config.icon}</div>
          <h1 className="text-3xl font-bold text-cream mb-4">{config.title}</h1>
          <p className="text-cream/70 text-lg mb-8">{config.message}</p>
          <div className="flex flex-col gap-3">
            {status === "fail" && (
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex btn-primary"
              >
                {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {dict.paymentResult?.tryAgain || "Try Again"}
              </Link>
            )}
            <Link
              href={`/${locale}`}
              className="inline-flex btn-secondary"
            >
              {dict.paymentResult?.backHome || "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymentResultPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <section className="min-h-screen flex items-center justify-center">
            <div className="text-cream/50">Loading...</div>
          </section>
        }
      >
        <PaymentResultContent />
      </Suspense>
      <Footer />
    </>
  );
}
