import { NextRequest, NextResponse } from "next/server";
import { readPortfolio, writePortfolio, extractYoutubeId } from "@/lib/portfolio-data";
import { isAuthenticated } from "@/lib/admin-auth";
import crypto from "crypto";

export async function GET() {
  const items = await readPortfolio();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, category, youtubeUrl, description } = body;

  if (!title || !youtubeUrl) {
    return NextResponse.json(
      { error: "Title and YouTube URL are required" },
      { status: 400 }
    );
  }

  if (!extractYoutubeId(youtubeUrl)) {
    return NextResponse.json(
      { error: "Invalid YouTube URL" },
      { status: 400 }
    );
  }

  const items = await readPortfolio();
  const newItem = {
    id: crypto.randomUUID(),
    title,
    category: category || "Uncategorized",
    youtubeUrl,
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  await writePortfolio(items);

  return NextResponse.json(newItem, { status: 201 });
}
