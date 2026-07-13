import ky, { HTTPError, type KyInstance, type Options } from "ky";

import { parseErrorBody } from "@/lib/api/parse-error";
import { ApiError } from "@/lib/api/types";
import { normalizeApiError, resolveApiErrorMessage } from "@/lib/auth/errors";
import { getAccessToken } from "@/lib/auth/tokens";

export type ApiRequestOptions = Options & {
  auth?: boolean;
  skipProfileIncompleteRedirect?: boolean;
};

type ProfileIncompleteHandler = () => void;

let profileIncompleteHandler: ProfileIncompleteHandler | null = null;

export function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "/v1";
  // Trailing slash required: without it, `new URL("auth/...", "…/v1")`
  // resolves to `…/auth/...` instead of `…/v1/auth/...`.
  return `${baseUrl.replace(/\/+$/, "")}/`;
}

export function setProfileIncompleteHandler(
  handler: ProfileIncompleteHandler | null,
) {
  profileIncompleteHandler = handler;
}

function createApiClient(): KyInstance {
  return ky.create({
    baseUrl: getApiBaseUrl(),
    timeout: 30_000,
    retry: {
      limit: 2,
      methods: ["get"],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        ({ request, options }) => {
          const { auth } = options as ApiRequestOptions;

          if (auth) {
            const accessToken = getAccessToken();
            if (accessToken) {
              request.headers.set("Authorization", `Bearer ${accessToken}`);
            }
          }

          if (!request.headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
            request.headers.set("Content-Type", "application/json");
          }
        },
      ],
      beforeError: [
        async ({ error, options }) => {
          if (!(error instanceof HTTPError)) {
            return error;
          }

          const { skipProfileIncompleteRedirect } =
            options as ApiRequestOptions;
          const body = await error.response.json().catch(() => null);
          const parsed = parseErrorBody(body, error.response.status);

          if (
            error.response.status === 403 &&
            parsed.code === "PROFILE_INCOMPLETE" &&
            !skipProfileIncompleteRedirect
          ) {
            profileIncompleteHandler?.();
          }

          return new ApiError(
            parsed.code,
            resolveApiErrorMessage(parsed.code, parsed.message, parsed.details),
            parsed.details,
          );
        },
      ],
    },
  });
}

export const apiClient = createApiClient();

export async function apiRequest<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  try {
    const response = await apiClient(path.replace(/^\//, ""), options);

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json<T>();
  } catch (error) {
    throw await normalizeApiError(error);
  }
}
