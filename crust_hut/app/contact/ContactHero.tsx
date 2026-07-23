import Image from "next/image";
import Link from "next/link";

export default function ContactHero() {
  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden bg-charcoal sm:min-h-[420px] lg:min-h-[460px]">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="menu-hero-bg absolute inset-[-8%] scale-110">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
            alt=""
            fill
            priority
            className="object-cover object-center blur-[5px] sm:blur-[7px]"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-charcoal/78" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/40 to-charcoal/88" />

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
          <span className="text-white/90">Contact</span>
        </nav>

        <h1 className="menu-hero-fade menu-hero-fade-2 font-[family-name:var(--font-outfit)] text-[clamp(2.75rem,8vw,5rem)] font-semibold tracking-[-0.04em] text-white">
          Contact Us
        </h1>

        <div
          className="menu-hero-fade menu-hero-fade-3 mx-auto mt-5 h-px w-12 bg-flame/80 sm:mt-6"
          aria-hidden
        />

        <p className="menu-hero-fade menu-hero-fade-4 mx-auto mt-5 max-w-2xl font-[family-name:var(--font-jakarta)] text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-base lg:text-lg">
          Reserve a table by the fire, ask a question, or simply say hello —
          we&apos;d love to welcome you to PIAZZO.
        </p>
      </div>
    </section>
  );
}
