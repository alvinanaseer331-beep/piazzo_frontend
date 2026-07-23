import Image from "next/image";
import Reveal from "../components/Reveal";

const collage = [
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85",
    alt: "Chef preparing fresh pizza",
    className:
      "relative z-[1] aspect-[3/4] w-[56%] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.14)]",
  },
  {
    src: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=85",
    alt: "Wood-fired pizza oven pie with blistered crust",
    className:
      "absolute right-0 top-4 z-[2] aspect-square w-[50%] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.16)] sm:top-8",
  },
  {
    src: "https://images.unsplash.com/photo-1478144592103-25e218a04891?w=800&q=85",
    alt: "Fresh pizza ingredients",
    className:
      "absolute bottom-0 right-4 z-[3] aspect-[4/3] w-[44%] overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(18,18,18,0.18)] sm:right-8",
  },
];

const stats = [
  { value: "20K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "Since 2018", label: "Crafted with pride" },
];

export default function OurStorySection() {
  return (
    <section className="section-pad overflow-hidden bg-white">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left — story */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame">
              Our Story
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-outfit)] text-3xl font-semibold leading-[1.15] tracking-tight text-charcoal sm:text-4xl">
              Crafted with Passion. Baked to Perfection.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ash sm:text-lg">
              <p>
                At PIAZZO, every pie begins with fresh ingredients and dough we
                handcraft with patience. Fired in our wood-burning oven, each
                pizza is finished with care — golden, fragrant, and made to be
                shared.
              </p>
              <p>
                More than a meal, we offer genuine hospitality and a warm table
                where flavors linger and evenings feel memorable. Come for the
                fire. Stay for the feeling.
              </p>
            </div>
          </Reveal>

          {/* Right — overlapping images */}
          <Reveal delay={2}>
            <div className="relative mx-auto min-h-[400px] w-full max-w-lg sm:min-h-[460px] lg:max-w-none">
              {collage.map((shot) => (
                <div key={shot.src} className={`group ${shot.className}`}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 70vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal>
          <div className="mt-14 grid gap-4 border-t border-line pt-10 sm:mt-16 sm:grid-cols-3 sm:gap-6 sm:pt-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[12px] border border-line bg-stone/50 px-6 py-7 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(18,18,18,0.06)]"
              >
                <p className="font-[family-name:var(--font-outfit)] text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-ash">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
