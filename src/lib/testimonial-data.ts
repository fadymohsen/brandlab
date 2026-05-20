import { getDb } from "./db";

export interface Testimonial {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  contentEn: string;
  contentAr: string;
  rating: number;
  imageUrl: string;
  createdAt: string;
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, name_en, name_ar, role_en, role_ar, content_en, content_ar, rating, image_url, created_at
    FROM testimonials
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    roleEn: row.role_en,
    roleAr: row.role_ar,
    contentEn: row.content_en,
    contentAr: row.content_ar,
    rating: row.rating,
    imageUrl: row.image_url ?? "",
    createdAt: row.created_at,
  }));
}

export async function createTestimonial(item: {
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  contentEn: string;
  contentAr: string;
  rating: number;
  imageUrl?: string;
}): Promise<Testimonial> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO testimonials (name_en, name_ar, role_en, role_ar, content_en, content_ar, rating, image_url)
    VALUES (${item.nameEn}, ${item.nameAr}, ${item.roleEn}, ${item.roleAr}, ${item.contentEn}, ${item.contentAr}, ${item.rating}, ${item.imageUrl ?? ""})
    RETURNING id, name_en, name_ar, role_en, role_ar, content_en, content_ar, rating, image_url, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    roleEn: row.role_en,
    roleAr: row.role_ar,
    contentEn: row.content_en,
    contentAr: row.content_ar,
    rating: row.rating,
    imageUrl: row.image_url ?? "",
    createdAt: row.created_at,
  };
}

export async function updateTestimonial(
  id: string,
  item: { nameEn?: string; nameAr?: string; roleEn?: string; roleAr?: string; contentEn?: string; contentAr?: string; rating?: number; imageUrl?: string }
): Promise<Testimonial | null> {
  const sql = getDb();
  const current = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  if (current.length === 0) return null;

  const rows = await sql`
    UPDATE testimonials
    SET
      name_en = ${item.nameEn ?? current[0].name_en},
      name_ar = ${item.nameAr ?? current[0].name_ar},
      role_en = ${item.roleEn ?? current[0].role_en},
      role_ar = ${item.roleAr ?? current[0].role_ar},
      content_en = ${item.contentEn ?? current[0].content_en},
      content_ar = ${item.contentAr ?? current[0].content_ar},
      rating = ${item.rating ?? current[0].rating},
      image_url = ${item.imageUrl ?? current[0].image_url ?? ""}
    WHERE id = ${id}
    RETURNING id, name_en, name_ar, role_en, role_ar, content_en, content_ar, rating, image_url, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    roleEn: row.role_en,
    roleAr: row.role_ar,
    contentEn: row.content_en,
    contentAr: row.content_ar,
    rating: row.rating,
    imageUrl: row.image_url ?? "",
    createdAt: row.created_at,
  };
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
