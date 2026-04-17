import { getDb } from "./db";

export interface Service {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  detailedEn: string;
  detailedAr: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
}

export async function listServices(): Promise<Service[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, title_en, title_ar, description_en, description_ar, detailed_en, detailed_ar, icon, sort_order, created_at
    FROM services
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows.map((row) => ({
    id: row.id,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    detailedEn: row.detailed_en,
    detailedAr: row.detailed_ar,
    icon: row.icon,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }));
}

export async function createService(item: {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  detailedEn: string;
  detailedAr: string;
  icon: string;
  sortOrder: number;
}): Promise<Service> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO services (title_en, title_ar, description_en, description_ar, detailed_en, detailed_ar, icon, sort_order)
    VALUES (${item.titleEn}, ${item.titleAr}, ${item.descriptionEn}, ${item.descriptionAr}, ${item.detailedEn}, ${item.detailedAr}, ${item.icon}, ${item.sortOrder})
    RETURNING id, title_en, title_ar, description_en, description_ar, detailed_en, detailed_ar, icon, sort_order, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    detailedEn: row.detailed_en,
    detailedAr: row.detailed_ar,
    icon: row.icon,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function updateService(
  id: string,
  item: Partial<Omit<Service, "id" | "createdAt">>
): Promise<Service | null> {
  const sql = getDb();
  const current = await sql`SELECT * FROM services WHERE id = ${id}`;
  if (current.length === 0) return null;

  const rows = await sql`
    UPDATE services
    SET
      title_en = ${item.titleEn ?? current[0].title_en},
      title_ar = ${item.titleAr ?? current[0].title_ar},
      description_en = ${item.descriptionEn ?? current[0].description_en},
      description_ar = ${item.descriptionAr ?? current[0].description_ar},
      detailed_en = ${item.detailedEn ?? current[0].detailed_en},
      detailed_ar = ${item.detailedAr ?? current[0].detailed_ar},
      icon = ${item.icon ?? current[0].icon},
      sort_order = ${item.sortOrder ?? current[0].sort_order}
    WHERE id = ${id}
    RETURNING id, title_en, title_ar, description_en, description_ar, detailed_en, detailed_ar, icon, sort_order, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    detailedEn: row.detailed_en,
    detailedAr: row.detailed_ar,
    icon: row.icon,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function deleteService(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM services WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
