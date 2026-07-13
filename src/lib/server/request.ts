import { apiError } from "@/lib/server/responses";
import { authenticatedUser } from "@/lib/server/auth";

export async function requireUser(request: Request) {
  const user = await authenticatedUser(request);
  if (!user) return { user: null, error: apiError("UNAUTHORIZED", "Authentication required", 401) } as const;
  if (user.status !== "active") return { user: null, error: apiError("ACCOUNT_SUSPENDED", "This account is not active", 403) } as const;
  return { user, error: null } as const;
}

export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_API_KEY;
  const supplied = request.headers.get("x-admin-api-key");
  if (!expected || supplied !== expected) {
    return apiError("FORBIDDEN", "A valid admin API key is required", 403);
  }
  return null;
}

export function getPagination(request: Request, max = 100) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const limit = Math.min(max, Math.max(1, Number(url.searchParams.get("limit") || 20) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

export function cleanSlug(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T> {
  return request.json().catch(() => ({} as T));
}
