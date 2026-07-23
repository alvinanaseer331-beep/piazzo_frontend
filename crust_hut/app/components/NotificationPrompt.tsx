"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const LS_ENABLED = "piazzo-notifications-enabled";
const SS_DISMISSED = "piazzo-notifications-dismissed";
const SS_LOCATION = "piazzo-location";
const DELAY_MS = 9000;

function shouldNeverAsk(): boolean {
  if (typeof window === "undefined") return true;
  if (localStorage.getItem(LS_ENABLED) === "1") return true;
  if (sessionStorage.getItem(SS_DISMISSED) === "1") return true;
  if (!("Notification" in window)) return true;
  if (Notification.permission === "granted") {
    localStorage.setItem(LS_ENABLED, "1");
    return true;
  }
  if (Notification.permission === "denied") return true;
  return false;
}

function hasSelectedLocation(): boolean {
  return sessionStorage.getItem(SS_LOCATION) !== null;
}

/**
 * Soft opt-in prompt for push notifications.
 * Shows only after location selection + time on homepage or Best Sellers scroll.
 */
export default function NotificationPrompt() {
  const titleId = useId();
  const descId = useId();
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const shownRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const showPrompt = useCallback(() => {
    if (shownRef.current || shouldNeverAsk() || !hasSelectedLocation()) return;
    shownRef.current = true;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    observerRef.current?.disconnect();
    setOpen(true);
  }, []);

  const armTriggers = useCallback(() => {
    if (shownRef.current || shouldNeverAsk()) return;

    timerRef.current = window.setTimeout(() => {
      showPrompt();
    }, DELAY_MS);

    const target = document.getElementById("bestsellers");
    if (target) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) showPrompt();
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
      );
      observerRef.current.observe(target);
    }
  }, [showPrompt]);

  useEffect(() => {
    if (shouldNeverAsk()) return;

    let cancelled = false;
    let pollId: number | null = null;

    const startWhenReady = () => {
      if (cancelled || shownRef.current) return;
      if (!hasSelectedLocation()) return;
      armTriggers();
    };

    if (hasSelectedLocation()) {
      startWhenReady();
    } else {
      pollId = window.setInterval(() => {
        if (hasSelectedLocation()) {
          if (pollId) window.clearInterval(pollId);
          pollId = null;
          startWhenReady();
        }
      }, 400);
    }

    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      observerRef.current?.disconnect();
    };
  }, [armTriggers]);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const handleNotNow = () => {
    sessionStorage.setItem(SS_DISMISSED, "1");
    setEntered(false);
    window.setTimeout(() => setOpen(false), 200);
  };

  const handleEnable = async () => {
    if (!("Notification" in window)) {
      handleNotNow();
      return;
    }

    setRequesting(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        localStorage.setItem(LS_ENABLED, "1");
        try {
          new Notification("PIAZZO", {
            body: "You’re set — we’ll keep you posted on orders and offers.",
            icon: "/favicon.svg",
          });
        } catch {
          // Some browsers block Notification constructor without service worker.
        }
      } else {
        sessionStorage.setItem(SS_DISMISSED, "1");
      }
    } finally {
      setRequesting(false);
      setEntered(false);
      window.setTimeout(() => setOpen(false), 200);
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center sm:p-6 ${
        entered ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
        aria-label="Dismiss notification prompt"
        onClick={handleNotNow}
      />

      <div
        className={`relative z-10 w-full max-w-[360px] rounded-[12px] border border-line bg-white p-5 shadow-[0_16px_40px_rgba(18,18,18,0.12)] transition-all duration-300 ease-out sm:p-6 ${
          entered
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.96] opacity-0 sm:translate-y-2"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-flame/10 text-lg"
            aria-hidden
          >
            🍕
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-[family-name:var(--font-outfit)] text-lg font-semibold tracking-tight text-charcoal"
            >
              Stay Updated 🍕
            </h2>
            <p
              id={descId}
              className="mt-1.5 text-sm leading-relaxed text-ash"
            >
              Receive order updates, exclusive offers, and new pizza launches.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleEnable}
            disabled={requesting}
            className="btn-primary w-full !min-h-11 flex-1 !px-4 !py-2.5 sm:w-auto"
          >
            {requesting ? "Please wait…" : "Enable Notifications"}
          </button>
          <button
            type="button"
            onClick={handleNotNow}
            disabled={requesting}
            className="inline-flex min-h-11 w-full flex-1 items-center justify-center rounded-[12px] border border-line px-4 text-sm font-semibold text-charcoal transition-colors hover:bg-mist sm:w-auto"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
