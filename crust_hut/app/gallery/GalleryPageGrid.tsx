"use client";

import Image from "next/image";
import { startTransition, useEffect, useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import { getGallery } from "../lib/services";
import type { GalleryImage } from "../lib/types";
import { ApiError } from "../lib/types";

/**
 * UI filters kept for existing gallery UX.
 * API mismatch: Gallery items have no category field (see API.md §9).
 * Client maps title/description keywords → Pizzas | Drinks | Other.
 */
const FILTERS = ["All", "Pizzas", "Drinks"] as const;

type UiCategory = "Pizzas" | "Drinks" | "Other";

type Shot = {
  id: number;
  src: string;
  alt: string;
  category: UiCategory;
  aspect: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=85";

const ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[5/4]",
  "aspect-[3/4]",
  "aspect-[4/3]",
];

function inferCategory(item: GalleryImage): UiCategory {
  const text = `${item.title} ${item.description ?? ""}`.toLowerCase();
  if (
    /drink|cocktail|juice|coffee|soda|beverage|wine|beer|mocktail/.test(text)
  ) {
    return "Drinks";
  }
  if (/pizza|margherita|pepperoni|crust|slice|cheese pull|pie/.test(text)) {
    return "Pizzas";
  }
  return "Other";
}

function GalleryImageEl({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      priority={priority}
      unoptimized={!current.includes("images.unsplash.com")}
      className={className}
      sizes={sizes}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}

export default function GalleryPageGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGallery({ is_active: true, limit: 100 });
        if (cancelled) return;
        setShots(
          data.items
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((item, i) => ({
              id: item.id,
              src: item.image_url || FALLBACK,
              alt: item.title,
              category: inferCategory(item),
              aspect: ASPECTS[i % ASPECTS.length],
            })),
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Failed to load gallery",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === "All") return shots;
    return shots.filter((s) => s.category === filter);
  }, [filter, shots]);

  const activeShot =
    lightboxIndex !== null ? (visible[lightboxIndex] ?? null) : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setLightboxOpen(true));
    });
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goPrev = () => {
    setLightboxIndex((i) => {
      if (i === null || visible.length === 0) return i;
      return (i - 1 + visible.length) % visible.length;
    });
  };

  const goNext = () => {
    setLightboxIndex((i) => {
      if (i === null || visible.length === 0) return i;
      return (i + 1) % visible.length;
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;

    let unmountTimer: ReturnType<typeof setTimeout> | undefined;
    if (!lightboxOpen) {
      unmountTimer = setTimeout(() => setLightboxIndex(null), 320);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null || visible.length === 0
            ? i
            : (i - 1 + visible.length) % visible.length,
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) =>
          i === null || visible.length === 0
            ? i
            : (i + 1) % visible.length,
        );
      }
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (unmountTimer) clearTimeout(unmountTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, lightboxOpen, visible.length]);

  useEffect(() => {
    setLightboxOpen(false);
    setLightboxIndex(null);
  }, [filter]);

  return (
    <section className="section-pad bg-stone">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <div>
              <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.22em] text-flame">
                Collection
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] text-charcoal">
                Every frame tells a story
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-[family-name:var(--font-jakarta)] text-[15px] leading-relaxed text-muted sm:text-base">
                Handcrafted pizzas and refreshing drinks — a taste of PIAZZO in
                every frame.
              </p>
            </div>

            <div
              className="flex max-w-3xl flex-wrap items-center justify-center gap-2"
              role="tablist"
              aria-label="Gallery categories"
            >
              {FILTERS.map((item) => {
                const active = filter === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      startTransition(() => setFilter(item));
                    }}
                    className={`rounded-[10px] px-3.5 py-2 font-[family-name:var(--font-jakarta)] text-sm font-semibold transition-all duration-300 ease-out sm:px-4 ${
                      active
                        ? "bg-charcoal text-white shadow-[0_8px_24px_rgba(18,18,18,0.12)]"
                        : "border border-line bg-white/70 text-muted hover:border-charcoal/25 hover:text-charcoal"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-12 columns-1 gap-4 sm:mt-14 sm:columns-2 sm:gap-5 md:columns-3 lg:columns-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`mb-4 break-inside-avoid animate-pulse rounded-[16px] bg-mist sm:mb-5 ${ASPECTS[i % ASPECTS.length]}`}
              />
            ))}
          </div>
        ) : error ? (
          <p className="mt-12 text-center text-sm text-ash">{error}</p>
        ) : visible.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ash">
            No gallery images match this filter yet.
          </p>
        ) : (
          <div
            key={filter}
            className="gallery-filter-grid mt-12 columns-1 gap-4 sm:mt-14 sm:columns-2 sm:gap-5 md:columns-3 lg:columns-4 lg:gap-5"
          >
            {visible.map((shot, i) => (
              <Reveal
                key={`${filter}-${shot.id}`}
                delay={(Math.min((i % 4) + 1, 4) as 1 | 2 | 3 | 4)}
                className="mb-4 break-inside-avoid sm:mb-5"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  className={`group relative block w-full overflow-hidden rounded-[16px] text-left shadow-[0_10px_32px_rgba(18,18,18,0.08)] transition-shadow duration-500 hover:shadow-[0_18px_48px_rgba(18,18,18,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame ${shot.aspect}`}
                >
                  <figure className="absolute inset-0">
                    <GalleryImageEl
                      src={shot.src}
                      alt={shot.alt}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/15 to-transparent opacity-55 transition-opacity duration-500 group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/25" />
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                      <span className="mb-1 block font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.16em] text-flame">
                        {shot.category}
                      </span>
                      <span className="font-[family-name:var(--font-jakarta)] text-sm font-medium leading-snug tracking-wide text-white/95">
                        {shot.alt}
                      </span>
                    </figcaption>
                  </figure>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && activeShot ? (
        <div
          className={`fixed inset-0 z-[80] flex items-center justify-center transition-[opacity,backdrop-filter] duration-300 ease-out ${
            lightboxOpen
              ? "bg-charcoal/92 opacity-100 backdrop-blur-md"
              : "bg-charcoal/0 opacity-0 backdrop-blur-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={activeShot.alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className={`absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 sm:right-6 sm:top-6 ${
              lightboxOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
            }`}
            aria-label="Close gallery image"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className={`absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12 ${
              lightboxOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M14.5 6.5 9 12l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className={`absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12 ${
              lightboxOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M9.5 6.5 15 12l-5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className={`relative mx-auto flex h-full w-full max-w-[1400px] flex-col items-center justify-center px-14 py-16 transition-all duration-300 ease-out sm:px-20 sm:py-20 ${
              lightboxOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-[0.96] opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[min(72vh,820px)] w-full overflow-hidden rounded-[16px] shadow-[0_32px_80px_rgba(0,0,0,0.45)] sm:rounded-[20px]">
              <GalleryImageEl
                key={activeShot.src}
                src={activeShot.src}
                alt={activeShot.alt}
                className="object-contain bg-charcoal"
                sizes="100vw"
                priority
              />
            </div>

            <div className="mt-5 flex w-full max-w-3xl flex-col items-center px-2 text-center sm:mt-6">
              <p className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.18em] text-flame">
                {activeShot.category}
                <span className="mx-2 text-white/25">·</span>
                <span className="text-white/45">
                  {(lightboxIndex ?? 0) + 1} / {visible.length}
                </span>
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-outfit)] text-base font-semibold tracking-tight text-white sm:text-lg">
                {activeShot.alt}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
