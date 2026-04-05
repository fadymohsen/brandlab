import { NextRequest, NextResponse } from "next/server";
import { readPortfolio, writePortfolio, extractYoutubeId } from "@/lib/portfolio-data";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, category, youtubeUrl, description } = body;

  if (youtubeUrl && !extractYoutubeId(youtubeUrl)) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  const items = await readPortfolio();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  items[index] = {
    ...items[index],
    ...(title && { title }),
    ...(category && { category }),
    ...(youtubeUrl && { youtubeUrl }),
    ...(description !== undefined && { description }),
  };

  await writePortfolio(items);
  return NextResponse.json(items[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const items = await readPortfolio();
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writePortfolio(filtered);
  return NextResponse.json({ ok: true });
}
