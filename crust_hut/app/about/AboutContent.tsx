import Image from "next/image";
import Reveal from "../components/Reveal";

const collage = [
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85",
    alt: "Chef preparing fresh pizza in the kitchen",
    className:
      "relative z-[1] aspect-[3/4] w-[58%] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.14)]",
  },
  {
    src: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=85",
    alt: "Wood-fired pizza with golden blistered crust",
    className:
      "absolute right-0 top-6 z-[2] aspect-square w-[48%] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.16)] sm:top-8",
  },
  {
    src: "https://images.unsplash.com/photo-1478144592103-25e218a04891?w=800&q=85",
    alt: "Fresh pizza ingredients ready for the oven",
    className:
      "absolute bottom-2 right-6 z-[3] aspect-[4/3] w-[42%] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.18)] sm:bottom-4 sm:right-10",
  },
];

const features = [
  {
    title: "Wood-Fired Oven",
    body: "Blistered crusts and deep flavor from an open flame at peak heat.",
  },
  {
    title: "Fresh Ingredients Daily",
    body: "Produce, cheese, and toppings prepped each morning — never yesterday’s.",
  },
  {
    title: "Handcrafted Dough",
    body: "Slow-fermented dough, stretched by hand for every single pie.",
  },
];

/** Full story content for the dedicated /about page. */
export default function AboutContent() {
  return (
    <section className="section-pad overflow-hidden bg-white">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame">
                Our Story
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-outfit)] text-3xl font-semibold leading-[1.15] tracking-tight text-charcoal sm:text-4xl lg:text-[2.75rem]">
                Crafted by Fire. Served with Passion.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ash sm:text-lg">
                PIAZZO started with a single wood-fired oven and a promise to
                never rush the dough. Every pie is stretched by hand, topped with
                care, and finished in the flame — the way pizza should taste.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ash sm:text-lg">
                Whether it’s a family Friday, a quiet date night, or a late crew
                after work, you’ll find a warm table and pizza made with pride.
                Come hungry. Leave happy.
              </p>
              <a href="/menu" className="btn-primary mt-8 inline-flex">
                Explore Menu
              </a>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12">
              {features.map((feature, i) => (
                <Reveal
                  key={feature.title}
                  delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}
                >
                  <div className="h-full rounded-[12px] border border-line bg-stone/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-charcoal/10 hover:shadow-[0_8px_24px_rgba(18,18,18,0.06)] sm:p-5">
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] bg-flame/10 text-flame">
                      {i === 0 && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364 1.386l-1.591 1.591M21 12h-2.25m-1.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      )}
                    </span>
                    <h2 className="font-[family-name:var(--font-outfit)] text-sm font-semibold text-charcoal sm:text-[15px]">
                      {feature.title}
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-ash sm:text-[13px]">
                      {feature.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={2} className="relative lg:col-span-7">
            <div className="relative mx-auto min-h-[420px] w-full max-w-xl pb-16 sm:min-h-[480px] lg:max-w-none lg:pb-20">
              {collage.map((shot) => (
                <div key={shot.src} className={`group ${shot.className}`}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 60vw, 40vw"
                  />
                </div>
              ))}

              <div className="absolute bottom-0 left-1/2 z-10 w-[min(92%,300px)] -translate-x-1/2 rounded-[16px] border border-white/20 bg-charcoal/55 p-5 shadow-[0_16px_40px_rgba(18,18,18,0.2)] backdrop-blur-xl sm:w-[320px] sm:p-6">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white sm:text-xl">
                      Est. 2018
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/50 sm:text-[11px]">
                      Since day one
                    </p>
                  </div>
                  <div className="border-x border-white/15 px-1">
                    <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white sm:text-xl">
                      20K+
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/50 sm:text-[11px]">
                      Happy Customers
                    </p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white sm:text-xl">
                      4.9★
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/50 sm:text-[11px]">
                      Average Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
