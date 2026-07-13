const AUTH_FLOW_PREFIXES = ["/sign-in", "/onboarding"];

/**
 * Returns a safe post-auth destination, or null if the URL would loop through
 * sign-in / onboarding again (the usual cause of nested callbackUrl params).
 */
export function sanitizeCallbackUrl(
  callbackUrl: string | null | undefined,
): string | null {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return null;
  }

  const pathname = callbackUrl.split("?")[0] ?? callbackUrl;

  if (
    AUTH_FLOW_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return null;
  }

  return callbackUrl;
}

export function getPostAuthRedirectPath(
  profileComplete: boolean,
  callbackUrl?: string | null,
) {
  const safeCallback = sanitizeCallbackUrl(callbackUrl);

  if (!profileComplete) {
    return safeCallback
      ? `/onboarding/profile?callbackUrl=${encodeURIComponent(safeCallback)}`
      : "/onboarding/profile";
  }

  return safeCallback ?? "/dashboard";
}

export function signInPathWithCallback(callbackUrl?: string | null) {
  const safeCallback = sanitizeCallbackUrl(callbackUrl);
  if (!safeCallback) return "/sign-in";
  return `/sign-in?callbackUrl=${encodeURIComponent(safeCallback)}`;
}
