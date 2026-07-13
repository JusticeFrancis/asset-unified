"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  logout as logoutRequest,
  persistAuthSession,
  refreshSession,
  sendOtp as sendOtpRequest,
  setProfileIncompleteHandler,
  updateProfile as updateProfileRequest,
  verifyOtp as verifyOtpRequest,
} from "@/lib/api/auth";
import { getPostAuthRedirectPath } from "@/lib/auth/callback-url";
import type {
  AuthUser,
  OtpSendResponse,
  OtpVerifyResponse,
  UpdateProfileRequest,
} from "@/lib/api/auth.types";
import { ApiError } from "@/lib/api/types";
import { clearAuthTokens, getAccessToken } from "@/lib/auth/tokens";

type AuthContextValue = {
  user: AuthUser | null;
  profileComplete: boolean;
  isLoading: boolean;
  sendOtp: (email: string) => Promise<OtpSendResponse>;
  verifyOtp: (
    otpSessionId: string,
    code: string,
    callbackUrl?: string | null,
    referralCode?: string | null,
  ) => Promise<OtpVerifyResponse>;
  updateProfile: (data: UpdateProfileRequest) => Promise<AuthUser>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
        try {
          await refreshSession();
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          return;
        } catch {
          clearAuthTokens();
          setUser(null);
          return;
        }
      }
      clearAuthTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setProfileIncompleteHandler(() => {
      router.replace("/onboarding/profile");
    });

    void bootstrapSession().finally(() => {
      setIsLoading(false);
    });

    return () => {
      setProfileIncompleteHandler(null);
    };
  }, [bootstrapSession, router]);

  const sendOtp = useCallback(async (email: string) => {
    return sendOtpRequest(email);
  }, []);

  const verifyOtp = useCallback(
    async (
      otpSessionId: string,
      code: string,
      callbackUrl?: string | null,
      referralCode?: string | null,
    ) => {
      const response = await verifyOtpRequest(otpSessionId, code, referralCode);
      persistAuthSession(response);
      setUser({
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        profileComplete: response.profileComplete,
        status: "active",
        kycStatus: response.user.kycStatus,
        walletStatus: response.user.walletStatus,
      });

      router.replace(
        getPostAuthRedirectPath(response.profileComplete, callbackUrl),
      );

      return response;
    },
    [router],
  );

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    const updatedUser = await updateProfileRequest(data);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const refreshSessionHandler = useCallback(async () => {
    await refreshSession();
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      router.replace("/sign-in");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profileComplete: user?.profileComplete ?? false,
      isLoading,
      sendOtp,
      verifyOtp,
      updateProfile,
      refreshSession: refreshSessionHandler,
      logout,
    }),
    [
      user,
      isLoading,
      sendOtp,
      verifyOtp,
      updateProfile,
      refreshSessionHandler,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
