import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { listOrders } from "@/lib/order-data";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
