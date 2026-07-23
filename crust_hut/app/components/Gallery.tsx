"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { getGallery } from "../lib/services";
import type { GalleryImage } from "../lib/types";

const FALLBACK =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=85";

const LAYOUT = [
  "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[420px]",
  "min-h-[200px] md:min-h-[200px]",
  "min-h-[200px]",
  "md:col-span-2 min-h-[220px] md:min-h-[240px]",
  "min-h-[220px]",
  "min-h-[220px]",
];

export default function Gallery() {
  const [shots, setShots] = useState<
    Array<{ src: string; alt: string; className: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await getGallery({ is_active: true, limit: 6 });
        if (cancelled) return;
        const mapped = data.items.slice(0, 6).map((item: GalleryImage, i) => ({
          src: item.image_url || FALLBACK,
          alt: item.title || item.description || "Gallery image",
          className: LAYOUT[i % LAYOUT.length],
        }));
        setShots(mapped);
      } catch {
        if (!cancelled) setShots([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="gallery" className="section-pad bg-stone">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Gallery"
            title="A house of fire and flavor"
            description="Moments from our kitchen and dining room — where craft, warmth, and appetite meet."
          />
        </Reveal>

        {loading ? (
          <div className="mt-12 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {LAYOUT.map((className, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-[16px] bg-mist ${className}`}
              />
            ))}
          </div>
        ) : shots.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ash">
            Gallery images will appear here once published in the CMS.
          </p>
        ) : (
          <div className="mt-12 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {shots.map((shot, i) => (
              <Reveal
                key={`${shot.src}-${i}`}
                delay={(Math.min((i % 4) + 1, 4) as 1 | 2 | 3 | 4)}
                className={shot.className}
              >
                <figure className="group relative h-full min-h-[inherit] overflow-hidden rounded-[16px] shadow-[0_8px_24px_rgba(18,18,18,0.08)]">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    unoptimized={!shot.src.includes("images.unsplash.com")}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-charcoal/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/25" />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-xs font-medium tracking-wide text-white/90">
                      {shot.alt}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={2}>
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link href="/gallery" className="btn-primary inline-flex">
              View All
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
