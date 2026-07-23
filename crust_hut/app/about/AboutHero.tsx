import Image from "next/image";
import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden bg-charcoal sm:min-h-[480px] lg:min-h-[520px]">
      <div className="menu-hero-bg absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=85"
          alt="Chefs preparing pizza by a wood-fired oven in warm restaurant light"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-charcoal/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/25 to-charcoal/45" />

      <div className="relative mx-auto w-full max-w-[1200px] px-8 py-24 text-center sm:px-10 sm:py-28 lg:px-16">
        <p className="menu-hero-fade menu-hero-fade-1 text-xs font-semibold uppercase tracking-[0.22em] text-flame">
          Our Story
        </p>

        <h1 className="menu-hero-fade menu-hero-fade-2 mx-auto mt-4 max-w-3xl font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.12]">
          Crafted by Fire. Shared with Passion.
        </h1>

        <p className="menu-hero-fade menu-hero-fade-3 mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base lg:text-lg">
          From handcrafted dough to unforgettable dining experiences, every
          pizza is made with premium ingredients, traditional techniques, and
          genuine hospitality.
        </p>

        <div className="menu-hero-fade menu-hero-fade-4 mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            href="/menu"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[12px] bg-flame px-8 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ember hover:shadow-[0_8px_20px_rgba(226,43,32,0.28)]"
          >
            View Menu
          </Link>
          <Link
            href="/contact#reserve"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[12px] border border-white/35 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </section>
  );
}
