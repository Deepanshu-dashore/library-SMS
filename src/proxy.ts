import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/registration" ||
    path === "/privacy" ||
    path === "/terms" ||
    path === "/sitemap.xml" ||
    path === "/robots.txt" ||
    path.startsWith("/receipt/") ||
    path.startsWith("/status/");


  // Get token from cookies
  const token = request.cookies.get("__lms_token")?.value || "";

  // If trying to access a protected route without a token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access login/register while already logged in
  if ((path === "/login" || path === "/registration") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Matching Paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any other public files (like login-bg.png etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp).*)",
  ],
};
