import Image from "next/image";
import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const posts = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80",
  "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80",
  "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=600&q=80",
];

export default function InstagramFeed() {
  return (
    <section id="instagram" className="section-pad bg-white">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Instagram"
            title="@piazzo"
            description="Follow the flame — daily oven pulls, late-night slices, and table moments."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-14">
          {posts.map((src, i) => (
            <Reveal key={src} delay={(Math.min((i % 4) + 1, 4) as 1 | 2 | 3 | 4)}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-[12px]"
              >
                <Image
                  src={src}
                  alt={`PIAZZO Instagram post ${i + 1}`}
                  fill
                  className="img-zoom object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-300 group-hover:bg-charcoal/45 group-hover:opacity-100">
                  <span className="text-sm font-semibold tracking-wide text-white">
                    View
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
            >
              Follow @piazzo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
