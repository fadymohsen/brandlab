import { NextRequest, NextResponse } from "next/server";
import { listTestimonials, createTestimonial } from "@/lib/testimonial-data";
import { initDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    await initDb();
    const items = await listTestimonials();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
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
    const { name, role, content, rating } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const item = await createTestimonial({
      name,
      role: role || "",
      content,
      rating: rating || 5,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
