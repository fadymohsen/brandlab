import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

function detectRegion(request: NextRequest): "EG" | "INT" {
  // Vercel provides country code via header
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return vercelCountry === "EG" ? "EG" : "INT";
  }

  // Cloudflare
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry) {
    return cfCountry === "EG" ? "EG" : "INT";
  }

  // AWS CloudFront
  const awsCountry = request.headers.get("cloudfront-viewer-country");
  if (awsCountry) {
    return awsCountry === "EG" ? "EG" : "INT";
  }

  return "INT";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — protect with cookie auth
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return;

    const session = request.cookies.get("admin_session");
    const expected = Buffer.from(
      process.env.ADMIN_PASSWORD ?? ""
    ).toString("base64");

    if (session?.value !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return;
  }

  // Detect region and set cookie on every request
  const region = detectRegion(request);

  // Locale routes
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.cookies.set("region", region, {
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set("region", region, {
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
