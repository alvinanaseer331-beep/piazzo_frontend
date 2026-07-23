import Image from "next/image";
import Reveal from "./Reveal";

export default function ChefsSpecial() {
  return (
    <section id="special" className="section-pad bg-charcoal">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1000&q=85"
                alt="Chef's special pizza with fresh toppings"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
              <div className="glass absolute bottom-5 left-5 right-5 rounded-[12px] p-4 sm:left-auto sm:right-5 sm:w-56">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-flame">
                  Limited
                </p>
                <p className="mt-1 font-[family-name:var(--font-outfit)] text-lg font-semibold text-white">
                  Tonight only
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame">
                Chef&apos;s Special
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Burrata Inferno
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
                A seasonal composition from our head pizzaiolo: blistered crust,
                roasted cherry tomatoes, torn burrata, chili oil, and wild
                oregano — finished under open flame.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-white/80">
                {[
                  "48-hour fermented dough",
                  "Imported burrata, served tableside",
                  "Pairs with house sparkling water or natural red",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <p className="font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white">
                  $28
                </p>
                <a href="#bestsellers" className="btn-primary">
                  Order the Special
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
