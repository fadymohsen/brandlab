import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";
import { getCountryFromHeaders, regionFromCountry, type Region } from "./lib/region";

function detectRegion(request: NextRequest): Region {
  return regionFromCountry(getCountryFromHeaders(request.headers));
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
