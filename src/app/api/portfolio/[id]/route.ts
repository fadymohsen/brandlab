import { NextRequest, NextResponse } from "next/server";
import { updatePortfolioItem, deletePortfolioItem, isValidVideoUrl } from "@/lib/portfolio-data";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, category, youtubeUrl, description } = body;

    if (youtubeUrl && !isValidVideoUrl(youtubeUrl)) {
      return NextResponse.json({ error: "Invalid video URL. Please use a YouTube or Instagram reel URL." }, { status: 400 });
    }

    const updated = await updatePortfolioItem(id, {
      title,
      category,
      youtubeUrl,
      description,
    });

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/portfolio error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deletePortfolioItem(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/portfolio error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
