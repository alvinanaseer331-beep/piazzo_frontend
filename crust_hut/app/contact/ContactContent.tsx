"use client";

import Image from "next/image";
import { FormEvent, useState, type ReactNode } from "react";
import Reveal from "../components/Reveal";
import { getSessionUser } from "../lib/auth";
import { createContactMessage, createReservation, toApiTime } from "../lib/services";
import { ApiError } from "../lib/types";

const HOURS = [
  { days: "Mon – Thu", time: "11:00 – 22:00" },
  { days: "Fri – Sat", time: "11:00 – 23:00" },
  { days: "Sunday", time: "12:00 – 21:00" },
] as const;

const FAQS = [
  {
    q: "Do you take walk-ins?",
    a: "Yes. Walk-ins are welcome daily. For Friday and Saturday evenings we recommend booking ahead.",
  },
  {
    q: "How far in advance can I reserve?",
    a: "You can request a table up to 30 days ahead. We’ll confirm by email within a few hours.",
  },
  {
    q: "Can I host a private event?",
    a: "Absolutely. Share your date and headcount in the reservation notes — our team will follow up.",
  },
] as const;

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M14.5 8.5H16V5.8c-.3 0-1.4-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.6V12H6.5v2.8h2.5V21h3.2v-6.2h2.7l.4-2.8h-3.1V10.5c0-.8.2-1.4 1.5-1.4Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M16.5 4c.4 2.2 1.8 3.7 4 4v2.4c-1.4 0-2.7-.4-3.9-1.2v5.6c0 3.3-2.6 5.7-5.8 5.7S5 18.1 5 14.8s2.6-5.7 5.8-5.7c.3 0 .6 0 .9.1v2.6a3.2 3.2 0 0 0-.9-.1c-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.1-1.4 3.1-3.1V4h2.6Z" />
      </svg>
    ),
  },
] as const;

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [contactSent, setContactSent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const user = getSessionUser();
      await createReservation({
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        party_size: Number(data.get("guests") || 1),
        reservation_date: String(data.get("date") || ""),
        reservation_time: toApiTime(String(data.get("time") || "")),
        special_requests: String(data.get("notes") || "").trim() || null,
        user_id: user?.id ?? null,
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not submit reservation",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactError(null);
    setContactSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await createContactMessage({
        name: String(data.get("contact_name") || "").trim(),
        email: String(data.get("contact_email") || "").trim(),
        phone: String(data.get("contact_phone") || "").trim() || null,
        subject: String(data.get("contact_subject") || "").trim(),
        message: String(data.get("contact_message") || "").trim(),
      });
      setContactSent(true);
      form.reset();
    } catch (err) {
      setContactError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not send message",
      );
    } finally {
      setContactSubmitting(false);
    }
  }

  return (
    <>
      {/* Reservation + interior */}
      <section id="reserve" className="section-pad relative overflow-hidden bg-stone">
        <div
          className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-flame/[0.06] blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="relative h-full min-h-[420px] overflow-hidden rounded-[24px] shadow-[0_28px_80px_rgba(18,18,18,0.12)] lg:min-h-full">
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85"
                  alt="Warm PIAZZO restaurant interior with ambient lighting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.18em] text-flame">
                    Dine with us
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    A table by the fire awaits
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="rounded-[24px] border border-white/70 bg-white/55 p-6 shadow-[0_16px_48px_rgba(18,18,18,0.08)] backdrop-blur-xl sm:p-8 lg:p-9">
                <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-flame">
                  Reservations
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                  Book your table
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Weekends fill fast. Share a few details and we&apos;ll confirm
                  your seat by email.
                </p>

                {submitted ? (
                  <div className="mt-8 flex min-h-[280px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-flame/10 text-flame">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                        <path
                          d="m5 13 4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="mt-4 font-[family-name:var(--font-outfit)] text-2xl font-semibold text-charcoal">
                      Request received
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                      We&apos;ll confirm your table by email shortly. See you by
                      the oven.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn-secondary mt-8 border-charcoal text-charcoal"
                    >
                      Make another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" name="name" required />
                      <Field label="Email" name="email" type="email" required />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Phone" name="phone" type="tel" required />
                      <Field
                        label="Guests"
                        name="guests"
                        type="number"
                        min={1}
                        max={12}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Date" name="date" type="date" required />
                      <Field label="Time" name="time" type="time" required />
                    </div>
                    <div>
                      <label
                        htmlFor="notes"
                        className="mb-2 block text-sm font-medium text-charcoal"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        placeholder="Allergies, high chair, celebration…"
                        className="w-full resize-none rounded-[12px] border border-line/80 bg-white/70 px-4 py-3 text-sm text-charcoal outline-none transition-all placeholder:text-muted/70 focus:border-flame/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(226,43,32,0.12)]"
                      />
                    </div>
                    {formError && (
                      <p
                        className="rounded-[10px] border border-flame/25 bg-flame/5 px-3 py-2 text-sm text-flame"
                        role="alert"
                      >
                        {formError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto disabled:opacity-60"
                      disabled={submitting}
                    >
                      {submitting ? "Sending…" : "Request Reservation"}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact message — POST /api/v1/contact */}
      <section id="message" className="border-t border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[720px] px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-flame">
                Get in touch
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                Send us a message
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Questions, catering, or feedback — we&apos;ll get back to you soon.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-8 rounded-[24px] border border-line/80 bg-stone/50 p-6 shadow-[0_12px_40px_rgba(18,18,18,0.05)] sm:p-8">
              {contactSent ? (
                <div className="py-10 text-center">
                  <p className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-charcoal">
                    Message sent
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Thanks — we&apos;ll reply to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSent(false)}
                    className="btn-secondary mt-6 border-charcoal text-charcoal"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onContactSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" name="contact_name" required />
                    <Field label="Email" name="contact_email" type="email" required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone" name="contact_phone" type="tel" />
                    <Field label="Subject" name="contact_subject" required />
                  </div>
                  <div>
                    <label
                      htmlFor="contact_message"
                      className="mb-2 block text-sm font-medium text-charcoal"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact_message"
                      name="contact_message"
                      rows={4}
                      required
                      minLength={5}
                      placeholder="How can we help?"
                      className="w-full resize-none rounded-[12px] border border-line/80 bg-white/70 px-4 py-3 text-sm text-charcoal outline-none transition-all placeholder:text-muted/70 focus:border-flame/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(226,43,32,0.12)]"
                    />
                  </div>
                  {contactError && (
                    <p
                      className="rounded-[10px] border border-flame/25 bg-flame/5 px-3 py-2 text-sm text-flame"
                      role="alert"
                    >
                      {contactError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto disabled:opacity-60"
                    disabled={contactSubmitting}
                  >
                    {contactSubmitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Details + hours */}
      <section className="border-y border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-flame">
                Find us
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                Visit PIAZZO
              </h2>

              <div className="mt-8 space-y-5">
                <InfoRow
                  label="Address"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <path
                        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  }
                >
                  I-8 Markaz
                  <br />
                  Islamabad
                </InfoRow>
                <InfoRow
                  label="Phone"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <path
                        d="M7.5 4.5h2.2l1.1 4.2-1.8 1.1a12.5 12.5 0 0 0 5.2 5.2l1.1-1.8 4.2 1.1v2.2A2.2 2.2 0 0 1 17.3 19 13.8 13.8 0 0 1 5 6.7a2.2 2.2 0 0 1 2.5-2.2Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                >
                  <a href="tel:+9251987661" className="hover:text-flame">
                    (051) 987661
                  </a>
                </InfoRow>
                <InfoRow
                  label="Email"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  }
                >
                  <a href="mailto:piazzo.offical@gmail.com" className="hover:text-flame">
                    piazzo.offical@gmail.com
                  </a>
                </InfoRow>
              </div>

              <div className="mt-10">
                <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  Follow along
                </p>
                <div className="mt-4 flex gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-stone text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:border-flame/40 hover:bg-flame hover:text-white hover:shadow-[0_10px_28px_rgba(226,43,32,0.25)]"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-flame">
                Hours
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                When we&apos;re open
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {HOURS.map((h) => (
                  <div
                    key={h.days}
                    className="rounded-[18px] border border-white/80 bg-gradient-to-br from-stone to-white p-5 shadow-[0_10px_36px_rgba(18,18,18,0.05)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                      {h.days}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-outfit)] text-lg font-semibold tracking-tight text-charcoal">
                      {h.time}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="bg-charcoal py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8 text-center sm:mb-10">
              <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-flame">
                Location
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                On the map
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="overflow-hidden rounded-[24px] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
              <iframe
                title="PIAZZO location map"
                src="https://maps.google.com/maps?q=I-8%20Markaz%20Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-[360px] w-full grayscale-[15%] contrast-[1.05] sm:h-[420px] lg:h-[480px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-stone">
        <div className="mx-auto max-w-[800px] px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <p className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.2em] text-flame">
                FAQ
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                Before you arrive
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <Reveal key={item.q} delay={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)}>
                  <div className="overflow-hidden rounded-[16px] border border-white/80 bg-white/70 shadow-[0_8px_28px_rgba(18,18,18,0.05)] backdrop-blur-md">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/80 sm:px-6"
                    >
                      <span className="font-[family-name:var(--font-outfit)] text-base font-semibold text-charcoal">
                        {item.q}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-stone text-charcoal transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-[16px] border border-line/70 bg-stone/60 p-4 transition-colors hover:border-flame/25">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame/10 text-flame">
        {icon}
      </div>
      <div>
        <p className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
        <p className="mt-1 font-[family-name:var(--font-outfit)] text-[15px] font-semibold leading-snug text-charcoal">
          {children}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-charcoal"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        className="h-12 w-full rounded-[12px] border border-line/80 bg-white/70 px-4 text-sm text-charcoal outline-none transition-all placeholder:text-muted/70 focus:border-flame/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(226,43,32,0.12)]"
      />
    </div>
  );
}
