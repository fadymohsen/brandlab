import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

const FAWATERAK_API_URL = "https://app.fawaterk.com/api/v2/invoiceInitPay";

// Debug endpoint — only works when logged in as admin
// Tests Fawaterak response for each payment method without creating an order
export async function POST(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized — admin only" }, { status: 401 });
    }

    const { paymentMethodId, amount, currency } = await req.json();

    const response = await fetch(FAWATERAK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FAWATERAK_API_KEY}`,
      },
      body: JSON.stringify({
        payment_method_id: Number(paymentMethodId) || 2,
        cartTotal: amount || 1,
        currency: currency || "EGP",
        customer: {
          first_name: "Test",
          last_name: "Debug",
          email: "debug@brandlab.test",
          phone: "01000000000",
          address: "-",
        },
        redirectionUrls: {
          successUrl: "https://brandlabagency.co/en/payment/result?status=success",
          failUrl: "https://brandlabagency.co/en/payment/result?status=fail",
          pendingUrl: "https://brandlabagency.co/en/payment/result?status=pending",
        },
        cartItems: [
          {
            name: "Debug Test",
            price: amount || 1,
            quantity: 1,
          },
        ],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      fawaterakStatus: response.status,
      rawResponse: data,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
