import {
  ApiError,
  parseApiErrorMessage,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export function getApiBaseUrl() {
  return API_BASE;
}

type ApiFetchOptions = RequestInit & {
  token?: string | null;
  /** Skip Content-Type application/json (e.g. FormData) */
  rawBody?: boolean;
};

/**
 * Fetch helper aligned with API.md §13.
 * Automatically attaches Bearer token when `token` is provided
 * or when `auth: true` and a stored token exists (client-only).
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions & { auth?: boolean } = {},
): Promise<T> {
  const { token, headers, auth, rawBody, ...rest } = options;

  let bearer = token ?? null;
  if (auth && !bearer && typeof window !== "undefined") {
    const { getAccessToken } = await import("./auth");
    bearer = getAccessToken();
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      ...(rawBody ? {} : { "Content-Type": "application/json" }),
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ detail: res.statusText }));
    const message = parseApiErrorMessage(errBody, res.statusText);

    if (res.status === 401 && typeof window !== "undefined") {
      const { clearSession } = await import("./auth");
      clearSession();
    }

    throw new ApiError(message, res.status, errBody);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
