import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROBOTS_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

// Simple in-memory rate limiter (resets on deploy; sufficient for low-traffic personal site)
const hits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requests per window
const RATE_WINDOW_MS = 60_000;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Block common probe paths used by scanners
const BLOCKED_PATHS = new Set([
  "/wp-admin",
  "/wp-login.php",
  "/.env",
  "/admin",
  "/api",
  "/sitemap.xml",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BLOCKED_PATHS.has(pathname) || pathname.startsWith("/wp-")) {
    return new NextResponse(null, { status: 404, headers: ROBOTS_HEADERS });
  }

  if (isRateLimited(getClientIp(request))) {
    return new NextResponse(null, { status: 429, headers: ROBOTS_HEADERS });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(ROBOTS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
