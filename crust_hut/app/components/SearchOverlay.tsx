"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  FALLBACK_MENU_IMAGE,
  mapMenuItem,
  type MenuItem,
} from "../menu/data";
import { getCategories, getMenuItems } from "../lib/services";
import type { Category as ApiCategory } from "../lib/types";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      setQuery("");
      return;
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    const focusId = window.setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = "hidden";

    setLoading(true);
    void (async () => {
      try {
        const [cats, menu] = await Promise.all([
          getCategories({ is_active: true, limit: 100 }),
          getMenuItems({ is_available: true, limit: 100 }),
        ]);
        const byId = new Map<number, ApiCategory>(
          cats.items.map((c) => [c.id, c]),
        );
        setItems(menu.items.map((item) => mapMenuItem(item, byId)));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(focusId);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categorySlug.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [query, items]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh] sm:px-6 ${
        visible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-md"
        aria-label="Close search"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-xl overflow-hidden rounded-[16px] border border-white/10 bg-[#1a1a1a] shadow-[0_16px_40px_rgba(18,18,18,0.35)] transition-all duration-300 ease-out ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-3 scale-[0.98] opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <svg
            className="h-5 w-5 shrink-0 text-white/45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <label htmlFor={titleId} className="sr-only">
            Search menu
          </label>
          <input
            id={titleId}
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pizzas, drinks…"
            className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-white/50 hover:text-white"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2 sm:p-3">
          {loading ? (
            <p className="px-3 py-8 text-center text-sm text-white/45">
              Searching menu…
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-white/45">
              No matches found
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-white/5">
                      <Image
                        src={item.image || FALLBACK_MENU_IMAGE}
                        alt={item.name}
                        fill
                        unoptimized={
                          !item.image.includes("images.unsplash.com")
                        }
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="block truncate text-xs text-white/45">
                        {item.categorySlug} · ${item.price.toFixed(2)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
