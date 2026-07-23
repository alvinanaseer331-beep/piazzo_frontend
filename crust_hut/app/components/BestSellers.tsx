"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { FALLBACK_MENU_IMAGE } from "../menu/data";
import { getFeaturedMenuItems, parseMoney } from "../lib/services";
import type { MenuItem } from "../lib/types";

type Card = {
  id: number;
  name: string;
  price: string;
  desc: string;
  image: string;
  tag: string;
};

export default function BestSellers() {
  const [items, setItems] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const featured = await getFeaturedMenuItems(4);
        if (cancelled) return;
        setItems(
          featured.map((item: MenuItem) => ({
            id: item.id,
            name: item.name,
            price: `$${parseMoney(item.price).toFixed(parseMoney(item.price) % 1 === 0 ? 0 : 2)}`,
            desc: item.description ?? "",
            image: item.image_url || FALLBACK_MENU_IMAGE,
            tag: item.is_featured ? "Bestseller" : "Popular",
          })),
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="bestsellers" className="section-pad bg-stone">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Best Sellers"
            title="Pies the city keeps ordering"
            description="Our most-loved wood-fired pizzas — stretched by hand, finished in the flame."
          />
        </Reveal>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-7">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[12px] border border-line bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-mist" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-mist" />
                  <div className="h-4 w-full animate-pulse rounded bg-mist" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="mt-12 text-center text-sm text-ash">{error}</p>
        ) : items.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ash">
            Featured pizzas will appear here once the menu is seeded.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-7">
            {items.map((item, i) => (
              <Reveal
                key={item.id}
                delay={(Math.min(i, 4) || 0) as 0 | 1 | 2 | 3 | 4}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-charcoal/15 hover:shadow-[0_8px_24px_rgba(18,18,18,0.08)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized={!item.image.includes("images.unsplash.com")}
                      className="img-zoom object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <span className="absolute left-3 top-3 rounded-[4px] bg-charcoal/85 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-charcoal">
                        {item.name}
                      </h3>
                      <span className="shrink-0 text-sm font-semibold text-flame">
                        {item.price}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ash">
                      {item.desc}
                    </p>
                    <Link
                      href="/menu"
                      className="mt-5 inline-flex text-sm font-semibold text-charcoal transition-colors hover:text-flame"
                    >
                      Add to order →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
