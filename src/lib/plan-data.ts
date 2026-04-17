import { getDb } from "./db";

export interface Plan {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  priceEg: string;
  priceInt: string;
  priceRawEg: number;
  priceRawInt: number;
  period: string;
  featuresEn: string;
  featuresAr: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
}

export async function listPlans(): Promise<Plan[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, name_en, name_ar, slug, description_en, description_ar,
           price_eg, price_int, price_raw_eg, price_raw_int, period,
           features_en, features_ar, is_featured, sort_order, created_at
    FROM plans
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows.map((row) => ({
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    slug: row.slug,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    priceEg: row.price_eg,
    priceInt: row.price_int,
    priceRawEg: Number(row.price_raw_eg),
    priceRawInt: Number(row.price_raw_int),
    period: row.period,
    featuresEn: row.features_en,
    featuresAr: row.features_ar,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }));
}

export async function createPlan(item: {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  priceEg: string;
  priceInt: string;
  priceRawEg: number;
  priceRawInt: number;
  period: string;
  featuresEn: string;
  featuresAr: string;
  isFeatured: boolean;
  sortOrder: number;
}): Promise<Plan> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO plans (name_en, name_ar, slug, description_en, description_ar, price_eg, price_int, price_raw_eg, price_raw_int, period, features_en, features_ar, is_featured, sort_order)
    VALUES (${item.nameEn}, ${item.nameAr}, ${item.slug}, ${item.descriptionEn}, ${item.descriptionAr}, ${item.priceEg}, ${item.priceInt}, ${item.priceRawEg}, ${item.priceRawInt}, ${item.period}, ${item.featuresEn}, ${item.featuresAr}, ${item.isFeatured}, ${item.sortOrder})
    RETURNING *
  `;
  const row = rows[0];
  return {
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    slug: row.slug,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    priceEg: row.price_eg,
    priceInt: row.price_int,
    priceRawEg: Number(row.price_raw_eg),
    priceRawInt: Number(row.price_raw_int),
    period: row.period,
    featuresEn: row.features_en,
    featuresAr: row.features_ar,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function updatePlan(
  id: string,
  item: Partial<Omit<Plan, "id" | "createdAt">>
): Promise<Plan | null> {
  const sql = getDb();
  const current = await sql`SELECT * FROM plans WHERE id = ${id}`;
  if (current.length === 0) return null;

  const rows = await sql`
    UPDATE plans
    SET
      name_en = ${item.nameEn ?? current[0].name_en},
      name_ar = ${item.nameAr ?? current[0].name_ar},
      slug = ${item.slug ?? current[0].slug},
      description_en = ${item.descriptionEn ?? current[0].description_en},
      description_ar = ${item.descriptionAr ?? current[0].description_ar},
      price_eg = ${item.priceEg ?? current[0].price_eg},
      price_int = ${item.priceInt ?? current[0].price_int},
      price_raw_eg = ${item.priceRawEg ?? current[0].price_raw_eg},
      price_raw_int = ${item.priceRawInt ?? current[0].price_raw_int},
      period = ${item.period ?? current[0].period},
      features_en = ${item.featuresEn ?? current[0].features_en},
      features_ar = ${item.featuresAr ?? current[0].features_ar},
      is_featured = ${item.isFeatured ?? current[0].is_featured},
      sort_order = ${item.sortOrder ?? current[0].sort_order}
    WHERE id = ${id}
    RETURNING *
  `;
  const row = rows[0];
  return {
    id: row.id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    slug: row.slug,
    descriptionEn: row.description_en,
    descriptionAr: row.description_ar,
    priceEg: row.price_eg,
    priceInt: row.price_int,
    priceRawEg: Number(row.price_raw_eg),
    priceRawInt: Number(row.price_raw_int),
    period: row.period,
    featuresEn: row.features_en,
    featuresAr: row.features_ar,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function deletePlan(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM plans WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
