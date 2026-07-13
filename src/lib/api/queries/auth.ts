"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/api/requests/auth";
import { authKeys } from "@/lib/api/query-keys/auth";
import { getAccessToken } from "@/lib/auth/tokens";

type UseCurrentUserOptions = {
  enabled?: boolean;
};

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { enabled = true } = options;
  const isBrowser = typeof window !== "undefined";

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    enabled: isBrowser && enabled && Boolean(getAccessToken()),
  });
}
