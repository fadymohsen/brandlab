import { NextRequest, NextResponse } from "next/server";
import { listCoupons, createCoupon } from "@/lib/coupon-data";
import { initDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const coupons = await listCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("GET /api/coupons error:", error);
    return NextResponse.json({ coupons: [], error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const body = await request.json();
    const { code, discountType, discountValue, currency, targetPlan, maxUses, expiresAt } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: "Code, discount type, and discount value are required" },
        { status: 400 }
      );
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return NextResponse.json(
        { error: "Discount type must be 'percentage' or 'fixed'" },
        { status: 400 }
      );
    }

    if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 1 and 100" },
        { status: 400 }
      );
    }

    const coupon = await createCoupon({
      code,
      discountType,
      discountValue: Number(discountValue),
      currency: currency || "USD",
      targetPlan: targetPlan || "all",
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt || null,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("POST /api/coupons error:", error);
    const msg = String(error);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
