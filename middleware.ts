import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_TOKEN_VALUE } from "@/lib/auth/config";

const locales = ["id", "en"];
const defaultLocale = "id";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin routes ─────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const isPublicAuth = PUBLIC_ADMIN_PATHS.includes(pathname);

    if (isPublicAuth && token === AUTH_TOKEN_VALUE) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (!isPublicAuth && token !== AUTH_TOKEN_VALUE) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // ─── i18n locale routing ──────────────────────────────────────
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon\\.ico|.*\\..*).*)",
  ],
};
