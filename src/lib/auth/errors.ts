import { HTTPError } from "ky";

import { parseErrorBody } from "@/lib/api/parse-error";
import { ApiError } from "@/lib/api/types";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OTP_INVALID: "That code is incorrect. Please try again.",
  OTP_SESSION_NOT_FOUND: "This code has expired. Request a new one.",
  OTP_MAX_ATTEMPTS: "Too many attempts. Request a new code.",
  OTP_RATE_LIMITED: "Too many requests. Please wait and try again.",
  OTP_UNAVAILABLE: "Unable to send a code right now. Please try again later.",
  ACCOUNT_SUSPENDED:
    "This account has been suspended. Contact support for help.",
  VALIDATION_ERROR: "Please check your details and try again.",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  USER_NOT_FOUND: "We couldn't find your account. Please sign in again.",
  PROFILE_INCOMPLETE:
    "Complete your profile before continuing to the dashboard.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource could not be found.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
  NETWORK_ERROR:
    "Unable to reach the server. Check your connection and try again.",
  TIMEOUT_ERROR: "The request timed out. Please try again.",
};

const GENERIC_BACKEND_MESSAGES = new Set([
  "",
  "request failed",
  "bad request",
  "unauthorized",
  "forbidden",
  "not found",
  "internal server error",
  "unknown error",
]);

function isGenericBackendMessage(message: string) {
  return GENERIC_BACKEND_MESSAGES.has(message.trim().toLowerCase());
}

function formatValidationDetails(details: unknown): string | null {
  if (!details) return null;

  if (typeof details === "string" && details.trim()) {
    return details;
  }

  if (Array.isArray(details)) {
    const messages = details
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          if (typeof record.message === "string") {
            if (typeof record.field === "string") {
              return `${record.field}: ${record.message}`;
            }
            return record.message;
          }
        }
        return null;
      })
      .filter((message): message is string => Boolean(message));

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (typeof details === "object") {
    const record = details as Record<string, unknown>;

    if (Array.isArray(record.issues)) {
      return formatValidationDetails(record.issues);
    }

    const fieldMessages = Object.entries(record).flatMap(([field, value]) => {
      if (typeof value === "string") return [`${field}: ${value}`];
      if (Array.isArray(value)) {
        return value
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => `${field}: ${entry}`);
      }
      return [];
    });

    if (fieldMessages.length > 0) {
      return fieldMessages.join(" ");
    }
  }

  return null;
}

export function resolveApiErrorMessage(
  code: string,
  backendMessage?: string,
  details?: unknown,
): string {
  if (code === "VALIDATION_ERROR") {
    const fromDetails = formatValidationDetails(details);
    if (fromDetails) return fromDetails;
  }

  const mapped = AUTH_ERROR_MESSAGES[code];
  if (mapped) return mapped;

  if (backendMessage && !isGenericBackendMessage(backendMessage)) {
    return backendMessage;
  }

  return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
}

export async function normalizeApiError(error: unknown): Promise<ApiError> {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof HTTPError) {
    const body = await error.response.json().catch(() => null);
    const parsed = parseErrorBody(body, error.response.status);

    return new ApiError(
      parsed.code,
      resolveApiErrorMessage(parsed.code, parsed.message, parsed.details),
      parsed.details,
    );
  }

  if (error instanceof Error) {
    if (error.name === "TimeoutError") {
      return new ApiError("TIMEOUT_ERROR", AUTH_ERROR_MESSAGES.TIMEOUT_ERROR);
    }

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError") ||
      error.message.includes("fetch failed")
    ) {
      return new ApiError("NETWORK_ERROR", AUTH_ERROR_MESSAGES.NETWORK_ERROR);
    }

    if (error.message && !isGenericBackendMessage(error.message)) {
      return new ApiError("UNKNOWN_ERROR", error.message);
    }
  }

  return new ApiError("UNKNOWN_ERROR", AUTH_ERROR_MESSAGES.UNKNOWN_ERROR);
}

export function getAuthErrorMessage(error: unknown, fallback?: string) {
  if (error instanceof ApiError) {
    return error.message || fallback || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  if (error instanceof HTTPError) {
    return fallback || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  if (error instanceof Error) {
    if (error.name === "TimeoutError") {
      return AUTH_ERROR_MESSAGES.TIMEOUT_ERROR;
    }

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError") ||
      error.message.includes("fetch failed")
    ) {
      return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (error.message && !isGenericBackendMessage(error.message)) {
      return error.message;
    }
  }

  return fallback || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
}
