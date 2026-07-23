import Image from "next/image";
import Link from "next/link";

export default function GalleryHero() {
  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden bg-charcoal sm:min-h-[420px] lg:min-h-[460px]">
      {/* Full-width blurred pizza backdrop */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="menu-hero-bg absolute inset-[-8%] scale-110">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=80"
            alt=""
            fill
            priority
            className="object-cover object-center blur-[6px] sm:blur-[8px]"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Dark overlays for depth and readability */}
      <div className="absolute inset-0 bg-charcoal/78" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/45 to-charcoal/85" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-24 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <nav
          aria-label="Breadcrumb"
          className="menu-hero-fade menu-hero-fade-1 mb-8 flex items-center justify-center gap-2 font-[family-name:var(--font-jakarta)] text-[12px] font-medium tracking-[0.08em] sm:mb-10 sm:text-[13px]"
        >
          <Link
            href="/"
            className="text-white/45 transition-colors duration-200 hover:text-white"
          >
            Home
          </Link>
          <span className="text-white/25" aria-hidden>
            /
          </span>
          <span className="text-white/90">Gallery</span>
        </nav>

        <h1 className="menu-hero-fade menu-hero-fade-2 font-[family-name:var(--font-outfit)] text-[clamp(2.75rem,8vw,5rem)] font-semibold tracking-[-0.04em] text-white">
          Gallery
        </h1>

        <div
          className="menu-hero-fade menu-hero-fade-3 mx-auto mt-5 h-px w-12 bg-flame/80 sm:mt-6"
          aria-hidden
        />

        <p className="menu-hero-fade menu-hero-fade-4 mx-auto mt-5 max-w-2xl font-[family-name:var(--font-jakarta)] text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-base lg:text-lg lg:leading-relaxed">
          A visual journey through our handcrafted pizzas, cozy interiors, and
          unforgettable dining experience.
        </p>
      </div>
    </section>
  );
}
