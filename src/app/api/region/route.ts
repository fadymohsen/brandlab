import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let region = "INT";

    // 1. Check hosting platform geo headers first (most reliable)
    const vercelCountry = request.headers.get("x-vercel-ip-country");
    const cfCountry = request.headers.get("cf-ipcountry");
    const awsCountry = request.headers.get("cloudfront-viewer-country");
    const platformCountry = vercelCountry || cfCountry || awsCountry;

    if (platformCountry) {
      region = platformCountry === "EG" ? "EG" : "INT";
    } else {
      // 2. Fallback to ipapi.co for non-platform environments
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0]?.trim() || "";

      const isLocal =
        !ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.");

      if (!isLocal) {
        const res = await fetch(`https://ipapi.co/${ip}/country/`, {
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const country = (await res.text()).trim();
          if (country === "EG") region = "EG";
        }
      }
    }

    const response = NextResponse.json({ region });
    response.cookies.set("region", region, {
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch {
    const response = NextResponse.json({ region: "INT" });
    response.cookies.set("region", "INT", {
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }
}
