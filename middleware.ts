import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/sign-in" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/verify-email" ||
    path === "/verify-email-new" ||
    path.startsWith("/employment") || // All employment pages (public) - jobs, search, bulk-hiring, etc.
    path.startsWith("/jobs") || // Jobs pages (public)
    path.startsWith("/marketplace") || // Marketplace (public)
    path.startsWith("/courses") || // Courses (public)
    path.startsWith("/blog") || // Blog (public)
    path.startsWith("/about") || // About pages (public)
    path.startsWith("/contact") || // Contact (public)
    path.startsWith("/help") || // Help pages (public)
    path.startsWith("/docs") || // Documentation (public)
    path.startsWith("/faq") || // FAQ (public)
    path.startsWith("/pricing") || // Pricing (public)
    path.startsWith("/features") || // Features (public)
    path.startsWith("/api/signup") ||
    path.startsWith("/api/verify-email") ||
    path.startsWith("/api/resend-verification") ||
    path.startsWith("/api/bulk-hiring/request") || // Allow bulk hiring request submission without auth
    path.startsWith("/api/contact") || // Allow contact form submission without auth
    path.startsWith("/api/jobs") || // Allow jobs API access without auth (read operations)
    path.startsWith("/api/cleanup") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico");

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, check if user is verified
  // This is a basic check - you might want to enhance this with session validation
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // If no token, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // For now, allow access if token exists
  // In a more robust implementation, you'd validate the token and check user status
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
