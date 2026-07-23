import Link from "next/link";
import Reveal from "./Reveal";

/** Compact homepage CTA — full reservation form lives on /contact */
export default function ReservationCTA() {
  return (
    <section
      id="reserve"
      className="relative overflow-hidden border-y border-line bg-[linear-gradient(165deg,#121212_0%,#1a1a1a_50%,#121212_100%)] py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-flame/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-ember/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[800px] px-5 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.22em] text-flame">
            Reservations
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-white">
            Save your seat by the fire
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-[family-name:var(--font-jakarta)] text-[15px] leading-relaxed text-white/60 sm:text-base">
            Weekends fill fast. Book a table for dine-in, or walk in anytime —
            we&apos;ll always try to make room.
          </p>
          <Link
            href="/contact#reserve"
            className="btn-primary mt-8 inline-flex"
          >
            Book a Table
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
