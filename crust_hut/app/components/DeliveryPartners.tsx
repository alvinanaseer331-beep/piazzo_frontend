"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const STATUS_STEPS = ["Preparing", "Baking", "Out for Delivery"] as const;

const PERKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 7v5.2l3.2 1.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Average Delivery Time",
    value: "25–35 mins",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M12 3.5 4.5 7v5.2c0 4.4 3.2 7.6 7.5 8.8 4.3-1.2 7.5-4.4 7.5-8.8V7L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Fresh & Hot Guarantee",
    value: "Oven to door, still steaming",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M4 8h11l2.2 5.4H7.4L4 8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M7.4 13.4 6 17h12.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="19" r="1.2" fill="currentColor" />
        <circle cx="16.5" cy="19" r="1.2" fill="currentColor" />
        <path
          d="M15 8V5.5h4.5V8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Free Delivery",
    value: "On orders above $25",
  },
] as const;

const PARTNERS = [
  { name: "Foodpanda", mark: "FP" },
  { name: "Uber Eats", mark: "UE" },
  { name: "DoorDash", mark: "DD" },
  { name: "Deliveroo", mark: "DR" },
] as const;

function LiveOrderStatus() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((prev) => (prev + 1) % STATUS_STEPS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rounded-[18px] border border-white/70 bg-white/55 p-4 shadow-[0_12px_40px_rgba(18,18,18,0.06)] backdrop-blur-xl sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-flame/50" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-flame" />
          </span>
          <p className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
            Live Order Status
          </p>
        </div>
        <span className="rounded-full bg-flame/10 px-3 py-1 font-[family-name:var(--font-jakarta)] text-[11px] font-bold text-flame">
          {STATUS_STEPS[step]}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1.5 sm:gap-2">
        {STATUS_STEPS.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold transition-all duration-500 sm:h-9 sm:w-9 ${
                    active
                      ? "scale-110 border-flame bg-flame text-white shadow-[0_8px_20px_rgba(226,43,32,0.35)]"
                      : done
                        ? "border-flame/40 bg-flame/10 text-flame"
                        : "border-line bg-white/80 text-muted"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                      <path
                        d="M3.5 8.2 6.4 11l6.1-6.2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
              </div>
              <p
                className={`text-center font-[family-name:var(--font-jakarta)] text-[10px] font-semibold leading-tight sm:text-[11px] ${
                  active ? "text-charcoal" : "text-muted"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember to-flame transition-all duration-700 ease-out"
          style={{ width: `${((step + 1) / STATUS_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function DeliveryPartners() {
  return (
    <section
      id="delivery"
      className="relative overflow-hidden border-y border-line bg-[linear-gradient(165deg,#F7F6F4_0%,#FFFFFF_42%,#F3F1ED_100%)] py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-flame/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-charcoal/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.22em] text-flame">
              Fast Delivery
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-charcoal">
              Hot pizza. At your door.
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-[family-name:var(--font-jakarta)] text-[15px] leading-relaxed text-muted sm:text-base">
              From our wood-fired ovens to your table — tracked live, guaranteed fresh, and free when you spend $25+.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div
                className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-flame/15 via-transparent to-charcoal/5 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[24px] border border-white/80 shadow-[0_28px_80px_rgba(18,18,18,0.12)]">
                <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
                  <Image
                    src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1000&q=85"
                    alt="Delivery rider on a scooter bringing hot pizza"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 90vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/15 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                    <p className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                      On the way
                    </p>
                    <p className="mt-0.5 font-[family-name:var(--font-outfit)] text-lg font-semibold tracking-tight text-white">
                      Your pie leaves the oven hot
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 top-8 hidden animate-[float_4s_ease-in-out_infinite] rounded-2xl border border-white/70 bg-white/80 px-3.5 py-2.5 shadow-[0_12px_32px_rgba(18,18,18,0.1)] backdrop-blur-md sm:block lg:-right-4">
                <p className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  ETA
                </p>
                <p className="font-[family-name:var(--font-outfit)] text-base font-semibold text-charcoal">
                  28 min
                </p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={1}>
              <div className="group flex items-start gap-4 rounded-[18px] border border-white/70 bg-white/55 p-4 shadow-[0_10px_36px_rgba(18,18,18,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-flame/25 hover:shadow-[0_16px_44px_rgba(18,18,18,0.08)] sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame/10 text-flame transition-colors duration-300 group-hover:bg-flame group-hover:text-white">
                  {PERKS[0].icon}
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                    {PERKS[0].label}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg font-semibold tracking-tight text-charcoal sm:text-xl">
                    {PERKS[0].value}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <LiveOrderStatus />
            </Reveal>

            {PERKS.slice(1).map((perk, i) => (
              <Reveal key={perk.label} delay={(Math.min(i + 3, 4) as 1 | 2 | 3 | 4)}>
                <div className="group flex items-start gap-4 rounded-[18px] border border-white/70 bg-white/55 p-4 shadow-[0_10px_36px_rgba(18,18,18,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-flame/25 hover:shadow-[0_16px_44px_rgba(18,18,18,0.08)] sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame/10 text-flame transition-colors duration-300 group-hover:bg-flame group-hover:text-white">
                    {perk.icon}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                      {perk.label}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg font-semibold tracking-tight text-charcoal sm:text-xl">
                      {perk.value}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={3}>
          <div className="mt-14 border-t border-line/80 pt-10 sm:mt-16">
            <p className="text-center font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
              Also available on
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.name}
                  href="#"
                  className="group flex min-w-[140px] items-center gap-3 rounded-2xl border border-white/80 bg-white/60 px-4 py-3.5 shadow-[0_8px_28px_rgba(18,18,18,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-flame/30 hover:shadow-[0_14px_36px_rgba(18,18,18,0.08)] sm:min-w-[160px]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-charcoal font-[family-name:var(--font-outfit)] text-[11px] font-bold tracking-wide text-white transition-colors duration-300 group-hover:bg-flame">
                    {partner.mark}
                  </span>
                  <span className="font-[family-name:var(--font-outfit)] text-[15px] font-semibold tracking-tight text-charcoal">
                    {partner.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
