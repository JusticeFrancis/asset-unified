import crypto from "node:crypto";
export async function bridgeRequest(path: string, request: Request, body?: unknown) {
  if (!process.env.BRIDGE_API_KEY) throw new Error("BRIDGE_API_KEY is not configured");
  const response = await fetch(`${process.env.BRIDGE_API_BASE_URL ?? "https://api.sandbox.bridge.xyz/v0"}${path}`, { method: body === undefined ? "GET" : "POST", headers: { "Api-Key": process.env.BRIDGE_API_KEY, "Content-Type": "application/json", ...(body === undefined ? {} : { "Idempotency-Key": request.headers.get("Idempotency-Key") ?? crypto.randomUUID() }) }, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store" });
  const data = await response.json().catch(() => null); return { data, status: response.status };
}
