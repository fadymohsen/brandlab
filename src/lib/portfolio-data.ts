import fs from "fs/promises";
import path from "path";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  description: string;
  createdAt: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

export async function readPortfolio(): Promise<PortfolioItem[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return data.items || [];
  } catch {
    return [];
  }
}

export async function writePortfolio(items: PortfolioItem[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify({ items }, null, 2), "utf-8");
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
