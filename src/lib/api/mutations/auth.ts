import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/lib/api/query-keys/auth";
import {
  getPostAuthRedirectPath,
  logout,
  persistAuthSession,
  refreshSession,
  sendOtp,
  updateProfile,
  verifyOtp,
} from "@/lib/api/requests/auth";
import type { UpdateProfileRequest } from "@/lib/api/auth.types";

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: sendOtp,
  });
}

type VerifyOtpVariables = {
  otpSessionId: string;
  code: string;
  callbackUrl?: string | null;
  referralCode?: string | null;
};

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ otpSessionId, code, referralCode }: VerifyOtpVariables) =>
      verifyOtp(otpSessionId, code, referralCode),
    onSuccess: (response, variables) => {
      persistAuthSession(response);
      queryClient.setQueryData(authKeys.me(), {
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        profileComplete: response.profileComplete,
        status: "active",
        kycStatus: response.user.kycStatus,
        walletStatus: response.user.walletStatus,
      });

      return getPostAuthRedirectPath(
        response.profileComplete,
        variables.callbackUrl,
      );
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

export function useRefreshSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
