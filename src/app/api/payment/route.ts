import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order-data";

const FAWATERAK_API_URL = "https://app.fawaterk.com/api/v2/invoiceInitPay";

export async function POST(req: Request) {
  try {
    const {
      planName,
      amount,
      currency,
      customerName,
      customerEmail,
      customerPhone,
      locale,
      couponCode,
      paymentMethodId,
    } = await req.json();

    if (!planName || !amount || !currency || !customerName || !customerEmail || !customerPhone || !paymentMethodId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const nameParts = customerName.trim().split(" ");
    const firstName = nameParts[0] || customerName;
    const lastName = nameParts.slice(1).join(" ") || "-";

    const response = await fetch(FAWATERAK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FAWATERAK_API_KEY}`,
      },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
        cartTotal: amount,
        currency,
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: customerEmail,
          phone: customerPhone,
          address: "-",
        },
        redirectionUrls: {
          successUrl: `${baseUrl}/${locale}/payment/result?status=success&plan=${encodeURIComponent(planName)}`,
          failUrl: `${baseUrl}/${locale}/payment/result?status=fail`,
          pendingUrl: `${baseUrl}/${locale}/payment/result?status=pending`,
        },
        cartItems: [
          {
            name: `Brand Lab - ${planName} Plan${couponCode ? ` (Coupon: ${couponCode})` : ""}`,
            price: amount,
            quantity: 1,
          },
        ],
      }),
    });

    const data = await response.json();

    // Log full Fawaterak response for debugging
    console.log("Fawaterak response:", JSON.stringify(data, null, 2));

    if (data.status === "success" && data.data) {
      const paymentData = data.data.payment_data || {};
      // Check all possible redirect URL locations
      const redirectUrl = paymentData.redirectTo
        || paymentData.redirect_to
        || paymentData.url
        || paymentData.payment_url
        || paymentData.walletRedirectUrl
        || paymentData.redirectUrl
        || data.data.redirectTo
        || data.data.redirect_to
        || data.data.url
        || data.data.payment_url
        || null;
      const fawryCode = paymentData.fawryCode || paymentData.referenceNumber || paymentData.fawry_ref || null;
      const finalRedirect = redirectUrl;

      await createOrder({
        invoiceId: String(data.data.invoice_id),
        invoiceKey: data.data.invoice_key,
        planName,
        amount,
        currency,
        status: fawryCode ? "pending" : "pending",
        customerName,
        customerEmail,
        customerPhone,
        couponCode: couponCode || null,
        paymentUrl: finalRedirect || null,
      });

      return NextResponse.json({
        success: true,
        paymentUrl: finalRedirect || null,
        fawryCode: fawryCode || null,
        invoiceId: data.data.invoice_id,
        invoiceKey: data.data.invoice_key,
      });
    }

    // Some Fawaterak responses have status "pending" for wallet
    if (data.status === "pending" && data.data) {
      const paymentData = data.data.payment_data || {};
      const redirectUrl = paymentData.redirectTo || paymentData.redirect_to || paymentData.url || null;

      await createOrder({
        invoiceId: String(data.data.invoice_id || ""),
        invoiceKey: data.data.invoice_key || "",
        planName,
        amount,
        currency,
        status: "pending",
        customerName,
        customerEmail,
        customerPhone,
        couponCode: couponCode || null,
        paymentUrl: redirectUrl || null,
      });

      return NextResponse.json({
        success: true,
        paymentUrl: redirectUrl || null,
        fawryCode: null,
        invoiceId: data.data.invoice_id,
        invoiceKey: data.data.invoice_key,
      });
    }

    return NextResponse.json(
      { error: data.message || "Failed to create payment" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Fawaterak payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
