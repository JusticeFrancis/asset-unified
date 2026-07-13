import { useQuery } from "@tanstack/react-query";

import { getCurrentAdmin } from "@/admin/lib/api/requests/admin-auth";
import { adminAuthKeys } from "@/admin/lib/api/query-keys/admin-auth";

type UseCurrentAdminOptions = {
  enabled?: boolean;
};

export function useCurrentAdmin(options: UseCurrentAdminOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: adminAuthKeys.me(),
    queryFn: getCurrentAdmin,
    enabled,
  });
}
