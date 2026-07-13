import { NextResponse, type NextRequest } from "next/server";

import { sanitizeCallbackUrl } from "@/lib/auth/callback-url";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/tokens";
import { ADMIN_AUTH_COOKIE_NAMES } from "@/admin/lib/auth/tokens";

const PUBLIC_AUTH_PATHS = ["/sign-in"];
const PUBLIC_ADMIN_AUTH_PATHS = ["/admin/sign-in", "/admin/accept-admin-invite"];

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

async function fetchProfileComplete(accessToken: string, origin: string) {
  const configured = getApiBaseUrl();
  const baseUrl = configured.startsWith("http") ? configured : `${origin}${configured || "/v1"}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) return null;

    const user = (await response.json()) as { profileComplete?: boolean };
    return user.profileComplete === true;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function redirectWithCallback(
  request: NextRequest,
  pathname: string,
  searchParams?: Record<string, string>,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  return NextResponse.redirect(url);
}

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function sanitizeAdminCallbackUrl(callbackUrl: string | null | undefined) {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return null;
  }
  const pathname = callbackUrl.split("?")[0] ?? callbackUrl;
  if (!pathname.startsWith("/admin")) return null;
  if (isPublicAdminPath(pathname)) return null;
  return callbackUrl;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminAccessToken = request.cookies.get(
    ADMIN_AUTH_COOKIE_NAMES.accessToken,
  )?.value;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminPublicRoute = isPublicAdminPath(pathname);

  if (isAdminRoute) {
    if (!adminAccessToken && !isAdminPublicRoute) {
      const rawCallback = `${pathname}${request.nextUrl.search}`;
      const callbackUrl = sanitizeAdminCallbackUrl(rawCallback);
      return redirectWithCallback(
        request,
        "/admin/sign-in",
        callbackUrl ? { callbackUrl } : undefined,
      );
    }

    if (adminAccessToken && isAdminPublicRoute) {
      const callbackUrl = sanitizeAdminCallbackUrl(
        request.nextUrl.searchParams.get("callbackUrl"),
      );
      return redirectWithCallback(request, callbackUrl ?? "/admin/dashboard");
    }

    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value;

  const isProtectedAppRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");
  const isSignInRoute = PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!accessToken) {
    if (isProtectedAppRoute) {
      const rawCallback = `${pathname}${request.nextUrl.search}`;
      const callbackUrl = sanitizeCallbackUrl(rawCallback);
      return redirectWithCallback(
        request,
        "/sign-in",
        callbackUrl ? { callbackUrl } : undefined,
      );
    }
    return NextResponse.next();
  }

  const profileComplete = await fetchProfileComplete(accessToken, request.nextUrl.origin);

  if (profileComplete === null) {
    if (isProtectedAppRoute) {
      const rawCallback = `${pathname}${request.nextUrl.search}`;
      const callbackUrl = sanitizeCallbackUrl(rawCallback);
      return redirectWithCallback(
        request,
        "/sign-in",
        callbackUrl ? { callbackUrl } : undefined,
      );
    }
    return NextResponse.next();
  }

  if (!profileComplete && pathname.startsWith("/dashboard")) {
    const callbackUrl = sanitizeCallbackUrl(pathname);
    return redirectWithCallback(
      request,
      "/onboarding/profile",
      callbackUrl ? { callbackUrl } : undefined,
    );
  }

  if (profileComplete && pathname.startsWith("/onboarding/profile")) {
    return redirectWithCallback(request, "/dashboard");
  }

  if (isSignInRoute) {
    return redirectWithCallback(
      request,
      profileComplete ? "/dashboard" : "/onboarding/profile",
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/sign-in",
    "/sign-in/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
