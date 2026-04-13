import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order-data";

const FAWATERAK_API_URL = "https://app.fawaterk.com/api/v2/createInvoiceLink";

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
    } = await req.json();

    if (!planName || !amount || !currency || !customerName || !customerEmail || !customerPhone) {
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
        sendEmail: true,
        sendSMS: false,
      }),
    });

    const data = await response.json();

    if (data.status === "success" && data.data?.url) {
      await createOrder({
        invoiceId: String(data.data.invoiceId),
        invoiceKey: data.data.invoiceKey,
        planName,
        amount,
        currency,
        status: "pending",
        customerName,
        customerEmail,
        customerPhone,
        couponCode: couponCode || null,
        paymentUrl: data.data.url,
      });

      return NextResponse.json({
        success: true,
        paymentUrl: data.data.url,
        invoiceId: data.data.invoiceId,
        invoiceKey: data.data.invoiceKey,
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
