import { getDb } from "./db";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt: string;
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, name, role, content, rating, created_at
    FROM testimonials
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    content: row.content,
    rating: row.rating,
    createdAt: row.created_at,
  }));
}

export async function createTestimonial(item: {
  name: string;
  role: string;
  content: string;
  rating: number;
}): Promise<Testimonial> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO testimonials (name, role, content, rating)
    VALUES (${item.name}, ${item.role}, ${item.content}, ${item.rating})
    RETURNING id, name, role, content, rating, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    content: row.content,
    rating: row.rating,
    createdAt: row.created_at,
  };
}

export async function updateTestimonial(
  id: string,
  item: { name?: string; role?: string; content?: string; rating?: number }
): Promise<Testimonial | null> {
  const sql = getDb();
  const current = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  if (current.length === 0) return null;

  const rows = await sql`
    UPDATE testimonials
    SET
      name = ${item.name ?? current[0].name},
      role = ${item.role ?? current[0].role},
      content = ${item.content ?? current[0].content},
      rating = ${item.rating ?? current[0].rating}
    WHERE id = ${id}
    RETURNING id, name, role, content, rating, created_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    content: row.content,
    rating: row.rating,
    createdAt: row.created_at,
  };
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
