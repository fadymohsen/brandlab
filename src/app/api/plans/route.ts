import { NextRequest, NextResponse } from "next/server";
import { listPlans, createPlan } from "@/lib/plan-data";
import { initDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    await initDb();
    const items = await listPlans();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/plans error:", error);
    return NextResponse.json({ items: [], error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const body = await request.json();

    if (!body.nameEn || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const item = await createPlan({
      nameEn: body.nameEn,
      nameAr: body.nameAr || "",
      slug: body.slug,
      descriptionEn: body.descriptionEn || "",
      descriptionAr: body.descriptionAr || "",
      priceEg: body.priceEg || "0",
      priceInt: body.priceInt || "0",
      priceRawEg: body.priceRawEg || 0,
      priceRawInt: body.priceRawInt || 0,
      period: body.period || "month",
      featuresEn: body.featuresEn || "",
      featuresAr: body.featuresAr || "",
      isFeatured: body.isFeatured || false,
      sortOrder: body.sortOrder || 0,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/plans error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
