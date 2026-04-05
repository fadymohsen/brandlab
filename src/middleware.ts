import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

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

  // Locale routes
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
