import { apiRequest } from "@/lib/api/client";
import type {
  AuthUser,
  OtpSendResponse,
  OtpVerifyResponse,
  UpdateProfileRequest,
} from "@/lib/api/auth.types";
import { ApiError } from "@/lib/api/types";
import { clearOtpSession } from "@/lib/auth/otp-session";
import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth/tokens";

export async function sendOtp(email: string) {
  return apiRequest<OtpSendResponse>("auth/login/otp/send", {
    method: "POST",
    json: { email },
  });
}

export async function verifyOtp(
  otpSessionId: string,
  code: string,
  referralCode?: string | null,
) {
  return apiRequest<OtpVerifyResponse>("auth/login/otp/verify", {
    method: "POST",
    json: { otpSessionId, code, referralCode: referralCode || undefined },
  });
}

export async function getCurrentUser() {
  return apiRequest<AuthUser>("auth/me", { auth: true });
}

export async function updateProfile(data: UpdateProfileRequest) {
  return apiRequest<AuthUser>("auth/me", {
    method: "PATCH",
    auth: true,
    json: data,
  });
}

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError("UNAUTHORIZED", "No refresh token available");
  }

  const response = await apiRequest<{
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }>("auth/refresh", {
    method: "POST",
    json: { refreshToken },
    skipProfileIncompleteRedirect: true,
  });

  setAuthTokens(
    response.accessToken,
    response.refreshToken,
    response.expiresAt,
  );

  return response;
}

export async function logout() {
  const refreshToken = getRefreshToken();

  try {
    await apiRequest<void>("auth/logout", {
      method: "POST",
      auth: true,
      json: refreshToken ? { refreshToken } : {},
      skipProfileIncompleteRedirect: true,
    });
  } finally {
    clearAuthTokens();
    clearOtpSession();
  }
}

export function persistAuthSession(response: OtpVerifyResponse) {
  setAuthTokens(
    response.accessToken,
    response.refreshToken,
    response.expiresAt,
  );
}

export { getPostAuthRedirectPath } from "@/lib/auth/callback-url";
