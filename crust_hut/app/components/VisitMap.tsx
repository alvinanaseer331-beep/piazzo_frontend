import Reveal from "./Reveal";

export default function VisitMap() {
  return (
    <section id="visit" className="section-pad bg-charcoal">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          <Reveal>
            <div className="flex h-full flex-col justify-center rounded-[16px] bg-flame p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                Visit PIAZZO
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ready for your next favorite slice?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
                Dine in by the oven, take out, or let us bring the fire to your
                door. Walk-ins welcome — weekends book ahead.
              </p>

              <div className="mt-8 space-y-5 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    Address
                  </p>
                  <p className="mt-1 text-lg">
                    I-8 Markaz
                    <br />
                    Islamabad
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    Contact
                  </p>
                  <p className="mt-1">
                    <a href="tel:+9251987661" className="hover:underline">
                      (051) 987661
                    </a>
                    <br />
                    <a
                      href="mailto:piazzo.offical@gmail.com"
                      className="hover:underline"
                    >
                      piazzo.offical@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#bestsellers"
                  className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-white px-7 text-sm font-semibold text-charcoal transition-transform hover:-translate-y-0.5"
                >
                  Order Online
                </a>
                <a
                  href="/contact#reserve"
                  className="inline-flex min-h-12 items-center justify-center rounded-[12px] border border-white/40 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Reserve
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="overflow-hidden rounded-[16px] border border-white/10 bg-ink min-h-[360px] lg:min-h-full">
              <iframe
                title="PIAZZO location map"
                src="https://maps.google.com/maps?q=I-8%20Markaz%20Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-full min-h-[360px] w-full grayscale-[20%] contrast-[1.05] lg:min-h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
