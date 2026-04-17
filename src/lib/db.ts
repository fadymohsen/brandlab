import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Uncategorized',
      youtube_url TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS coupons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT NOT NULL UNIQUE,
      discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
      discount_value NUMERIC(10,2) NOT NULL,
      currency TEXT DEFAULT 'USD',
      target_plan TEXT DEFAULT 'all',
      max_uses INTEGER DEFAULT NULL,
      current_uses INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      expires_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id TEXT,
      invoice_key TEXT,
      plan_name TEXT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EGP',
      status TEXT NOT NULL DEFAULT 'pending',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      coupon_code TEXT,
      payment_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title_en TEXT NOT NULL,
      title_ar TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      description_ar TEXT NOT NULL DEFAULT '',
      detailed_en TEXT NOT NULL DEFAULT '',
      detailed_ar TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT 'Film',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL,
      description_en TEXT NOT NULL DEFAULT '',
      description_ar TEXT NOT NULL DEFAULT '',
      price_eg TEXT NOT NULL DEFAULT '0',
      price_int TEXT NOT NULL DEFAULT '0',
      price_raw_eg NUMERIC(10,2) NOT NULL DEFAULT 0,
      price_raw_int NUMERIC(10,2) NOT NULL DEFAULT 0,
      period TEXT NOT NULL DEFAULT 'month',
      features_en TEXT NOT NULL DEFAULT '',
      features_ar TEXT NOT NULL DEFAULT '',
      is_featured BOOLEAN DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
