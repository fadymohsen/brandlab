import { NextRequest, NextResponse } from "next/server";
import { readPortfolio, createPortfolioItem, isValidVideoUrl } from "@/lib/portfolio-data";
import { initDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    await initDb();
    const items = await readPortfolio();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
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
    const { title, category, youtubeUrl, description } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: "YouTube Short URL is required" },
        { status: 400 }
      );
    }

    if (!isValidVideoUrl(youtubeUrl)) {
      return NextResponse.json(
        { error: "Invalid URL. Please use a YouTube Short URL." },
        { status: 400 }
      );
    }

    const newItem = await createPortfolioItem({
      title: title || "",
      category: category || "",
      youtubeUrl,
      description: description || "",
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
