import { getDb, initDb } from "./db";

export interface Order {
  id: string;
  invoiceId: string | null;
  invoiceKey: string | null;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  couponCode: string | null;
  paymentUrl: string | null;
  createdAt: string;
}

export async function createOrder(data: {
  invoiceId?: string;
  invoiceKey?: string;
  planName: string;
  amount: number;
  currency: string;
  status?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  couponCode?: string | null;
  paymentUrl?: string;
}): Promise<Order> {
  await initDb();
  const sql = getDb();
  const rows = await sql`
    INSERT INTO orders (invoice_id, invoice_key, plan_name, amount, currency, status, customer_name, customer_email, customer_phone, coupon_code, payment_url)
    VALUES (${data.invoiceId || null}, ${data.invoiceKey || null}, ${data.planName}, ${data.amount}, ${data.currency}, ${data.status || "pending"}, ${data.customerName}, ${data.customerEmail}, ${data.customerPhone}, ${data.couponCode || null}, ${data.paymentUrl || null})
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function listOrders(): Promise<Order[]> {
  await initDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows.map(mapRow);
}

export async function updateOrderStatus(invoiceId: string, status: string) {
  const sql = getDb();
  await sql`UPDATE orders SET status = ${status} WHERE invoice_id = ${invoiceId}`;
}

function mapRow(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    invoiceId: row.invoice_id as string | null,
    invoiceKey: row.invoice_key as string | null,
    planName: row.plan_name as string,
    amount: Number(row.amount),
    currency: row.currency as string,
    status: row.status as string,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: row.customer_phone as string,
    couponCode: row.coupon_code as string | null,
    paymentUrl: row.payment_url as string | null,
    createdAt: row.created_at as string,
  };
}
