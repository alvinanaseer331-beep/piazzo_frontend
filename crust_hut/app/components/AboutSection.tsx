import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

/** Compact story preview on the homepage — full story lives on /about. */
export default function AboutSection() {
  return (
    <section id="story" className="section-pad overflow-hidden bg-white">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=85"
                alt="Chef preparing pizza at PIAZZO"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame">
              Our Story
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
              Crafted by Fire. Served with Passion.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ash sm:text-lg">
              PIAZZO began with one wood-fired oven and a promise to never rush
              the dough. Every pie is handcrafted and finished in the flame —
              made for every table that gathers here.
            </p>
            <Link href="/about" className="btn-primary mt-8 inline-flex">
              Read Our Story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
