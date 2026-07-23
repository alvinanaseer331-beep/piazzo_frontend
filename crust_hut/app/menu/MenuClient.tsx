"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import PiazzoLogo from "../components/PiazzoLogo";
import {
  FALLBACK_MENU_IMAGE,
  mapCategoryTabs,
  mapMenuItem,
  type MenuCategoryTab,
  type MenuItem,
} from "./data";
import { addToCart as pushToCart } from "../lib/cart";
import { getCategories, getMenuItems } from "../lib/services";
import type { Category as ApiCategory } from "../lib/types";
import { ApiError } from "../lib/types";

type SortKey = "popularity" | "price-asc" | "price-desc";

function formatPrice(price: number) {
  return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}

function isAllowedImageHost(src: string) {
  try {
    const host = new URL(src).hostname;
    return (
      host === "images.unsplash.com" ||
      host === "localhost" ||
      host === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

function MenuSafeImage({
  src,
  alt,
  priority = false,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_MENU_IMAGE);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_MENU_IMAGE);
  }, [src]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      priority={priority}
      unoptimized={!isAllowedImageHost(currentSrc)}
      loading={priority ? undefined : "lazy"}
      className={className}
      sizes={sizes}
      onError={() => {
        if (currentSrc !== FALLBACK_MENU_IMAGE) {
          setCurrentSrc(FALLBACK_MENU_IMAGE);
        }
      }}
    />
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-charcoal">
      <svg
        className="h-3.5 w-3.5 text-flame"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span>{rating.toFixed(1)}</span>
    </span>
  );
}

function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-white">
      <div className="aspect-[4/3] animate-pulse bg-mist" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-mist" />
        <div className="h-4 w-full animate-pulse rounded bg-mist" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-mist" />
        <div className="h-11 w-full animate-pulse rounded-[12px] bg-mist" />
      </div>
    </div>
  );
}

function MenuItemCard({
  item,
  favorited,
  onToggleFavorite,
  onAddToCart,
}: {
  item: MenuItem;
  favorited: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (item: MenuItem) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-charcoal/15 hover:shadow-[0_8px_24px_rgba(18,18,18,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <MenuSafeImage
          src={item.image}
          alt={item.imageAlt}
          className="img-zoom object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.dietary === "veg" && (
            <span className="rounded-[4px] bg-basil px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
              Veg
            </span>
          )}
          {item.dietary === "chicken" && (
            <span className="rounded-[4px] bg-charcoal/85 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
              Chicken
            </span>
          )}
          {item.popular && (
            <span className="rounded-[4px] bg-flame px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
              Popular
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={
            favorited ? `Remove ${item.name} from favourites` : `Favourite ${item.name}`
          }
          aria-pressed={favorited}
          onClick={() => onToggleFavorite(item.id)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm transition-transform duration-200 hover:scale-105"
        >
          <svg
            className={`h-5 w-5 transition-colors ${
              favorited ? "fill-flame text-flame" : "fill-none text-charcoal"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-charcoal">
            {item.name}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-flame">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ash">
          {item.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 text-ash">
          <StarRating rating={item.rating} />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0a9 9 0 0118 0z"
              />
            </svg>
            {item.prepTime}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="btn-primary mt-5 w-full !min-h-11"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default function MenuClient() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<MenuCategoryTab[]>([
    { id: "all", label: "All", apiId: null },
  ]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("popularity");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const loadMenu = useCallback(async () => {
    setReady(false);
    setLoadError(null);
    try {
      const [catRes, itemRes] = await Promise.all([
        getCategories({ is_active: true, limit: 100 }),
        getMenuItems({ is_available: true, limit: 100 }),
      ]);
      const byId = new Map<number, ApiCategory>(
        catRes.items.map((c) => [c.id, c]),
      );
      setCategories(mapCategoryTabs(catRes.items));
      setItems(itemRes.items.map((item) => mapMenuItem(item, byId)));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load menu";
      setLoadError(message);
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const activeCat = categories.find((c) => c.id === category);
    let list = items.filter((item) => {
      const catOk =
        category === "all" ||
        item.category === category ||
        (activeCat?.apiId != null && item.categoryId === activeCat.apiId);
      const searchOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return catOk && searchOk;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (a.popular !== b.popular) return a.popular ? -1 : 1;
      return b.rating - a.rating;
    });

    return list;
  }, [category, search, sort, items, categories]);

  const grouped = useMemo(() => {
    if (category !== "all") {
      const label = categories.find((c) => c.id === category)?.label ?? "";
      return [{ id: category, label, items: filtered }];
    }
    return categories
      .filter((c) => c.id !== "all")
      .map((c) => ({
        id: c.id,
        label: c.label,
        items: filtered.filter(
          (item) =>
            item.category === c.id ||
            (c.apiId != null && item.categoryId === c.apiId),
        ),
      }));
  }, [category, filtered, categories]);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addToCart(item: MenuItem) {
    pushToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setToast(`${item.name} added to cart`);
  }

  return (
    <>
      <Navbar />
      <main className="bg-stone">
        <section className="menu-hero relative flex h-[320px] items-center overflow-hidden bg-charcoal sm:h-[340px] lg:h-[360px]">
          <div className="menu-hero-bg absolute inset-0">
            <MenuSafeImage
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=85"
              alt="Fresh wood-fired pizza"
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-charcoal/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-charcoal/30" />

          <div className="relative mx-auto w-full max-w-[1200px] px-8 pt-16 text-center sm:px-10 sm:pt-14 lg:px-16">
            <nav
              aria-label="Breadcrumb"
              className="menu-hero-fade menu-hero-fade-1 mb-4 text-sm text-white/55"
            >
              <ol className="flex flex-wrap items-center justify-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-white/35">
                  /
                </li>
                <li className="font-medium text-white">Menu</li>
              </ol>
            </nav>

            <h1 className="menu-hero-fade menu-hero-fade-2 font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Crafted Fresh. Baked to Perfection.
            </h1>
            <p className="menu-hero-fade menu-hero-fade-3 mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base">
              Discover handcrafted pizzas, refreshing drinks, and signature
              flavors made with premium ingredients.
            </p>

            <div className="menu-hero-fade menu-hero-fade-4 mt-6 flex flex-col items-center justify-center gap-3 sm:mt-7 sm:flex-row sm:gap-4">
              <a
                href="#menu-catalog"
                className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-[12px] bg-flame px-7 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ember hover:shadow-[0_8px_20px_rgba(226,43,32,0.28)]"
              >
                Explore Menu
              </a>
              <a
                href="#menu-catalog"
                className="inline-flex h-11 min-w-[160px] items-center justify-center rounded-[12px] border border-white/35 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
              >
                Order Online
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-[1200px] px-5 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <label htmlFor="menu-search" className="sr-only">
                  Search menu
                </label>
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ash"
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
                <input
                  id="menu-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pizzas & drinks…"
                  className="h-12 w-full rounded-[8px] border border-line bg-mist pl-10 pr-4 text-sm text-charcoal outline-none transition-colors placeholder:text-ash/70 focus:border-flame focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="menu-sort" className="text-sm font-medium text-ash">
                  Sort
                </label>
                <select
                  id="menu-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-12 rounded-[8px] border border-line bg-mist px-3 text-sm font-medium text-charcoal outline-none focus:border-flame focus:bg-white"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div
              className="mt-5 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Menu categories"
            >
              {categories.map((cat) => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat.id)}
                    className={`relative shrink-0 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                      active ? "text-flame" : "text-ash hover:text-charcoal"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-flame transition-all duration-300 ${
                        active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="menu-catalog" className="section-pad !pt-10 lg:!pt-14">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
            {!ready ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MenuCardSkeleton key={i} />
                ))}
              </div>
            ) : loadError ? (
              <div className="rounded-[12px] border border-line bg-white px-6 py-16 text-center">
                <p className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-charcoal">
                  Couldn’t load the menu
                </p>
                <p className="mt-2 text-sm text-ash">{loadError}</p>
                <button
                  type="button"
                  onClick={() => void loadMenu()}
                  className="btn-primary mt-6"
                >
                  Try again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[12px] border border-line bg-white px-6 py-16 text-center">
                <PiazzoLogo variant="mark" markSize={48} tone="onLight" />
                <p className="mt-4 font-[family-name:var(--font-outfit)] text-xl font-semibold text-charcoal">
                  No matches
                </p>
                <p className="mt-2 text-sm text-ash">
                  Try another search or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="btn-secondary mt-6 border-charcoal text-charcoal"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-14 lg:space-y-16">
                {grouped.map(
                  (group) =>
                    group.items.length > 0 && (
                      <div key={group.id} id={group.id}>
                        {category === "all" && (
                          <Reveal>
                            <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                              {group.label}
                            </h2>
                            <div className="mt-2 h-0.5 w-10 bg-flame" />
                          </Reveal>
                        )}
                        <div
                          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
                            category === "all" ? "mt-8" : ""
                          }`}
                        >
                          {group.items.map((item, i) => (
                            <Reveal
                              key={item.id}
                              delay={(Math.min((i % 3) + 1, 3) as 1 | 2 | 3)}
                            >
                              <MenuItemCard
                                item={item}
                                favorited={favorites.has(item.id)}
                                onToggleFavorite={toggleFavorite}
                                onAddToCart={addToCart}
                              />
                            </Reveal>
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[90] w-[min(92vw,360px)] -translate-x-1/2 rounded-[12px] bg-charcoal px-4 py-3 text-center text-sm font-medium text-white shadow-[0_16px_40px_rgba(18,18,18,0.2)]"
        >
          {toast}
        </div>
      )}
    </>
  );
}
