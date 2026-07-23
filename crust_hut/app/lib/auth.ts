import type { ApiUser, AuthResponse } from "./types";
import { apiFetch } from "./api";

const TOKEN_KEY = "piazzo-access-token";
const EXPIRES_KEY = "piazzo-token-expires-at";
const USER_KEY = "piazzo-user";

export const AUTH_EVENT = "piazzo-auth-updated";
/** @deprecated Use AUTH_EVENT — kept so Navbar listeners still work during migration */
export const USER_EVENT = AUTH_EVENT;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

function emitAuth() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

function toSessionUser(user: ApiUser): SessionUser {
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const expiresAt = Number(localStorage.getItem(EXPIRES_KEY) || 0);
    if (expiresAt && Date.now() > expiresAt) {
      clearSession();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.email || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistAuth(response: AuthResponse) {
  const expiresAt = Date.now() + response.expires_in * 1000;
  localStorage.setItem(TOKEN_KEY, response.access_token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
  localStorage.setItem(USER_KEY, JSON.stringify(toSessionUser(response.user)));
  emitAuth();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(USER_KEY);
  emitAuth();
}

export async function signup(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  persistAuth(data);
  return data;
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  persistAuth(data);
  return data;
}

export async function logout() {
  clearSession();
}

export async function fetchCurrentUser(): Promise<SessionUser | null> {
  const token = getAccessToken();
  if (!token) {
    clearSession();
    return null;
  }
  try {
    const user = await apiFetch<ApiUser>("/api/v1/auth/me", {
      method: "GET",
      token,
    });
    const session = toSessionUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(session));
    emitAuth();
    return session;
  } catch {
    clearSession();
    return null;
  }
}
