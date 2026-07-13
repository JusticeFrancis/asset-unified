type ParsedApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export function inferErrorCodeFromStatus(status: number): string {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 410:
      return "OTP_SESSION_NOT_FOUND";
    case 429:
      return "OTP_RATE_LIMITED";
    case 503:
      return "OTP_UNAVAILABLE";
    default:
      return "UNKNOWN_ERROR";
  }
}

export function parseErrorBody(body: unknown, status: number): ParsedApiError {
  if (!body || typeof body !== "object") {
    return {
      code: inferErrorCodeFromStatus(status),
      message: "",
    };
  }

  const record = body as Record<string, unknown>;

  if (record.error && typeof record.error === "object") {
    const nested = record.error as Record<string, unknown>;
    return {
      code: String(nested.code ?? inferErrorCodeFromStatus(status)),
      message: pickMessage(nested.message),
      details: nested.details,
    };
  }

  if (typeof record.error === "string") {
    return {
      code: record.error,
      message: pickMessage(record.message),
      details: record.details,
    };
  }

  if (typeof record.code === "string") {
    return {
      code: record.code,
      message: pickMessage(record.message),
      details: record.details,
    };
  }

  if (typeof record.message === "string") {
    return {
      code: inferErrorCodeFromStatus(status),
      message: record.message,
      details: record.details,
    };
  }

  return {
    code: inferErrorCodeFromStatus(status),
    message: "",
  };
}

function pickMessage(value: unknown) {
  return typeof value === "string" ? value : "";
}
