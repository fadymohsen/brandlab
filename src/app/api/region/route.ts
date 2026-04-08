import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Check if we already have a region cookie
  const existing = request.cookies.get("region")?.value;
  if (existing === "EG" || existing === "INT") {
    return NextResponse.json({ region: existing });
  }

  // Try to detect country from IP using free geolocation API
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "";

    // Skip geolocation for local/private IPs
    const isLocal =
      !ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.");

    let region = "INT"; // default to international

    if (!isLocal) {
      const res = await fetch(`https://ipapi.co/${ip}/country/`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const country = (await res.text()).trim();
        if (country === "EG") region = "EG";
      }
    }

    const response = NextResponse.json({ region });
    response.cookies.set("region", region, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch {
    // On any error, default to international
    const response = NextResponse.json({ region: "INT" });
    response.cookies.set("region", "INT", {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }
}
