"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AUTH_EVENT,
  fetchCurrentUser,
  getSessionUser,
  login,
  logout,
  signup,
  type SessionUser,
} from "../lib/auth";
import { ApiError, parseApiErrorMessage } from "../lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type Mode = "login" | "signup";

type UserProfileMenuProps = {
  onOpenChange?: () => void;
};

export default function UserProfileMenu({ onOpenChange }: UserProfileMenuProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    sync();
    void fetchCurrentUser().then((u) => {
      if (u) setUser(u);
    });
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!signInOpen) {
      setSignInVisible(false);
      return;
    }

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const id = window.requestAnimationFrame(() => setSignInVisible(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setSignInOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [signInOpen, loading]);

  function openSignIn() {
    onOpenChange?.();
    setDropdownOpen(false);
    setError(null);
    setSuccess(null);
    setMode("signup");
    setSignInOpen(true);
  }

  function closeModal() {
    if (loading) return;
    setSignInOpen(false);
    setError(null);
    setSuccess(null);
  }

  function resetForm() {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await login({
          email: email.trim(),
          password,
        });
        setUser({
          id: res.user.id,
          name: res.user.full_name,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
        });
        setSuccess("Welcome back!");
      } else {
        const res = await signup({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || null,
        });
        // signup() persists the access token — user is signed in automatically
        setUser({
          id: res.user.id,
          name: res.user.full_name,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
        });
        setSuccess("Account created!");
      }
      window.setTimeout(() => {
        setSignInOpen(false);
        resetForm();
        setSuccess(null);
      }, 700);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await logout();
    setUser(null);
    setDropdownOpen(false);
  }

  const authModal =
    signInOpen && mounted
      ? createPortal(
          <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${
              signInVisible ? "opacity-100" : "opacity-0"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="absolute inset-0 bg-charcoal/70 backdrop-blur-md"
              aria-label="Close authentication"
              onClick={closeModal}
            />
            <div
              className={`relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[16px] border border-white/10 bg-[#1a1a1a] p-6 shadow-[0_16px_40px_rgba(18,18,18,0.35)] transition-all duration-300 sm:p-8 ${
                signInVisible
                  ? "translate-y-0 scale-100"
                  : "translate-y-4 scale-[0.98]"
              }`}
            >
              <h2
                id={titleId}
                className="font-[family-name:var(--font-outfit)] text-2xl font-semibold text-white"
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </h2>
              <p className="mt-2 text-sm text-white/55">
                {mode === "login"
                  ? "Welcome back to PIAZZO — save favorites and track orders."
                  : "Join PIAZZO to reserve faster and track your orders."}
              </p>

              <div className="mt-5 flex rounded-[10px] border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 rounded-[8px] py-2 text-sm font-semibold transition-colors ${
                    mode === "login"
                      ? "bg-flame text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 rounded-[8px] py-2 text-sm font-semibold transition-colors ${
                    mode === "signup"
                      ? "bg-flame text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate={false}>
                {mode === "signup" && (
                  <>
                    <div>
                      <label
                        htmlFor="piazzo-signin-name"
                        className="mb-2 block text-sm font-medium text-white/80"
                      >
                        Full name
                      </label>
                      <input
                        id="piazzo-signin-name"
                        name="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        maxLength={150}
                        autoComplete="name"
                        className="h-12 w-full rounded-[8px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-flame"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="piazzo-signin-phone"
                        className="mb-2 block text-sm font-medium text-white/80"
                      >
                        Phone
                      </label>
                      <input
                        id="piazzo-signin-phone"
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        maxLength={30}
                        autoComplete="tel"
                        className="h-12 w-full rounded-[8px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-flame"
                        placeholder="(051) 987661"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label
                    htmlFor="piazzo-signin-email"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Email
                  </label>
                  <input
                    id="piazzo-signin-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 w-full rounded-[8px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-flame"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="piazzo-signin-password"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Password
                  </label>
                  <input
                    id="piazzo-signin-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="h-12 w-full rounded-[8px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-flame"
                    placeholder="Min. 8 characters"
                  />
                </div>

                {error && (
                  <p
                    className="rounded-[8px] border border-flame/30 bg-flame/10 px-3 py-2 text-sm text-flame"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                {success && (
                  <p
                    className="rounded-[8px] border border-basil/30 bg-basil/10 px-3 py-2 text-sm text-basil"
                    role="status"
                  >
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full disabled:opacity-60"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait…"
                    : mode === "login"
                      ? "Sign In"
                      : "Create Account"}
                </button>

                {mode === "signup" ? (
                  <p className="text-center text-sm text-white/55">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="font-semibold text-flame hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-sm text-white/55">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="font-semibold text-flame hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </form>
            </div>
          </div>,
          document.body,
        )
      : null;

  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={openSignIn}
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-white/20 bg-white/5 px-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
          aria-label="Sign up"
        >
          <svg
            className="h-[18px] w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="hidden sm:inline">Sign Up</span>
        </button>
        {authModal}
      </>
    );
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => {
          onOpenChange?.();
          setDropdownOpen((v) => !v);
        }}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-flame text-sm font-bold text-white transition-transform hover:scale-105"
        aria-label="Account menu"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
      >
        {initials(user.name) || "P"}
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-56 overflow-hidden rounded-[12px] border border-line bg-white shadow-[0_16px_40px_rgba(18,18,18,0.12)]"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-charcoal">
              {user.name}
            </p>
            <p className="truncate text-xs text-ash">{user.email}</p>
          </div>
          <div className="p-1.5">
            <a
              href="/orders"
              role="menuitem"
              className="block rounded-[8px] px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-mist"
              onClick={() => setDropdownOpen(false)}
            >
              My Orders
            </a>
            <a
              href="/contact#reserve"
              role="menuitem"
              className="block rounded-[8px] px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-mist"
              onClick={() => setDropdownOpen(false)}
            >
              Reservations
            </a>
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleSignOut()}
              className="block w-full rounded-[8px] px-3 py-2.5 text-left text-sm font-medium text-flame transition-colors hover:bg-mist"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
