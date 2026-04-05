import { getDb } from "./db";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  description: string;
  createdAt: string;
}

export async function readPortfolio(): Promise<PortfolioItem[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, title, category, youtube_url, description, created_at
    FROM portfolio
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    youtubeUrl: row.youtube_url,
    description: row.description,
    createdAt: row.created_at,
  }));
}

export async function createPortfolioItem(item: {
  title: string;
  category: string;
  youtubeUrl: string;
  description: string;
}): Promise<PortfolioItem> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO portfolio (title, category, youtube_url, description)
    VALUES (${item.title}, ${item.category}, ${item.youtubeUrl}, ${item.description})
    RETURNING id, title, category, youtube_url, description, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    youtubeUrl: row.youtube_url,
    description: row.description,
    createdAt: row.created_at,
  };
}

export async function updatePortfolioItem(
  id: string,
  item: { title?: string; category?: string; youtubeUrl?: string; description?: string }
): Promise<PortfolioItem | null> {
  const sql = getDb();
  const current = await sql`SELECT * FROM portfolio WHERE id = ${id}`;
  if (current.length === 0) return null;

  const rows = await sql`
    UPDATE portfolio
    SET
      title = ${item.title ?? current[0].title},
      category = ${item.category ?? current[0].category},
      youtube_url = ${item.youtubeUrl ?? current[0].youtube_url},
      description = ${item.description !== undefined ? item.description : current[0].description}
    WHERE id = ${id}
    RETURNING id, title, category, youtube_url, description, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    youtubeUrl: row.youtube_url,
    description: row.description,
    createdAt: row.created_at,
  };
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM portfolio WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
