import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-charcoal">
      <Image
        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=85"
        alt="Wood-fired pizza with blistered crust"
        fill
        priority
        className="object-cover object-center scale-105 animate-[fade-in_1.2s_ease-out]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/75 to-charcoal/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1200px] flex-col justify-end px-5 pb-16 pt-28 sm:px-6 sm:pb-20 lg:justify-center lg:px-8 lg:pb-24 lg:pt-32">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-flame sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-flame" aria-hidden />
            Born of Fire.
          </p>

          <h1 className="font-[family-name:var(--font-outfit)] text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            PIAZZO
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:mt-6 sm:text-lg">
            Wood-fired pizza for the modern table — craft dough, flame, and
            hospitality that feels like home.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <a href="#bestsellers" className="btn-primary">
              Order Now
            </a>
            <a
              href="/contact#reserve"
              className="btn-secondary border-white/30 text-white hover:border-white/60 hover:bg-white/5"
            >
              Reserve a Table
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
