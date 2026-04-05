import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? "").toString(
    "base64"
  );
  return session?.value === expected;
}
