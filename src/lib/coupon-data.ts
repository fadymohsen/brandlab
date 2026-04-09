import { getDb } from "./db";

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency: string;
  targetPlan: string;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

function mapRow(row: Record<string, unknown>): Coupon {
  return {
    id: row.id as string,
    code: row.code as string,
    discountType: row.discount_type as "percentage" | "fixed",
    discountValue: Number(row.discount_value),
    currency: row.currency as string,
    targetPlan: row.target_plan as string,
    maxUses: row.max_uses as number | null,
    currentUses: row.current_uses as number,
    isActive: row.is_active as boolean,
    expiresAt: row.expires_at as string | null,
    createdAt: row.created_at as string,
  };
}

export async function listCoupons(): Promise<Coupon[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM coupons ORDER BY created_at DESC
  `;
  return rows.map(mapRow);
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM coupons WHERE id = ${id}`;
  return rows.length > 0 ? mapRow(rows[0]) : null;
}

export async function createCoupon(data: {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency?: string;
  targetPlan?: string;
  maxUses?: number | null;
  expiresAt?: string | null;
}): Promise<Coupon> {
  const sql = getDb();
  const code = data.code.toUpperCase();
  const rows = await sql`
    INSERT INTO coupons (code, discount_type, discount_value, currency, target_plan, max_uses, expires_at)
    VALUES (
      ${code},
      ${data.discountType},
      ${data.discountValue},
      ${data.currency ?? "USD"},
      ${data.targetPlan ?? "all"},
      ${data.maxUses ?? null},
      ${data.expiresAt ?? null}
    )
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function updateCoupon(
  id: string,
  data: {
    code?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    currency?: string;
    targetPlan?: string;
    maxUses?: number | null;
    isActive?: boolean;
    expiresAt?: string | null;
  }
): Promise<Coupon | null> {
  const sql = getDb();
  const current = await sql`SELECT * FROM coupons WHERE id = ${id}`;
  if (current.length === 0) return null;

  const c = current[0];
  const rows = await sql`
    UPDATE coupons SET
      code = ${data.code !== undefined ? data.code.toUpperCase() : c.code},
      discount_type = ${data.discountType ?? c.discount_type},
      discount_value = ${data.discountValue ?? c.discount_value},
      currency = ${data.currency ?? c.currency},
      target_plan = ${data.targetPlan ?? c.target_plan},
      max_uses = ${data.maxUses !== undefined ? data.maxUses : c.max_uses},
      is_active = ${data.isActive !== undefined ? data.isActive : c.is_active},
      expires_at = ${data.expiresAt !== undefined ? data.expiresAt : c.expires_at}
    WHERE id = ${id}
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM coupons WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function incrementCouponUsage(id: string): Promise<void> {
  const sql = getDb();
  await sql`UPDATE coupons SET current_uses = current_uses + 1 WHERE id = ${id}`;
}

export async function validateCoupon(
  code: string,
  planSlug: string,
  currency: string
): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM coupons WHERE UPPER(code) = ${code.toUpperCase()}`;

  if (rows.length === 0) {
    return { valid: false, error: "invalidCode" };
  }

  const coupon = mapRow(rows[0]);

  if (!coupon.isActive) {
    return { valid: false, error: "invalidCode" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: "expired" };
  }

  if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, error: "maxUsesReached" };
  }

  if (coupon.targetPlan !== "all" && coupon.targetPlan !== planSlug) {
    return { valid: false, error: "wrongPlan" };
  }

  if (coupon.discountType === "fixed" && coupon.currency !== currency) {
    return { valid: false, error: "wrongCurrency" };
  }

  return { valid: true, coupon };
}
