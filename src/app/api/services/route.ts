import { NextRequest, NextResponse } from "next/server";
import { listServices, createService } from "@/lib/service-data";
import { initDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    await initDb();
    const items = await listServices();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/services error:", error);
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

    if (!body.titleEn) {
      return NextResponse.json({ error: "English title is required" }, { status: 400 });
    }

    const item = await createService({
      titleEn: body.titleEn,
      titleAr: body.titleAr || "",
      descriptionEn: body.descriptionEn || "",
      descriptionAr: body.descriptionAr || "",
      detailedEn: body.detailedEn || "",
      detailedAr: body.detailedAr || "",
      icon: body.icon || "Film",
      sortOrder: body.sortOrder || 0,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
