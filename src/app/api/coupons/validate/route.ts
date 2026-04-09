import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon-data";
import { initDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { code, planSlug, currency } = body;

    if (!code || !planSlug || !currency) {
      return NextResponse.json(
        { valid: false, error: "invalidCode" },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, planSlug, currency);

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error });
    }

    const coupon = result.coupon!;
    return NextResponse.json({
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      currency: coupon.currency,
      couponId: coupon.id,
    });
  } catch (error) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json({ valid: false, error: "invalidCode" }, { status: 500 });
  }
}
