import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const reasons = [
  {
    title: "Wood-Fired Oven",
    body: "Blistered crusts and deep smoky flavor from an open flame at peak heat.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    title: "Fresh Daily Ingredients",
    body: "Produce, cheese, and toppings prepped each morning — never yesterday’s leftovers.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364 1.386l-1.591 1.591M21 12h-2.25m-1.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: "Handmade Dough",
    body: "Slow-fermented dough, stretched by hand for an airy crumb and perfect bite.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    title: "Fast & Friendly Service",
    body: "Warm hospitality and quick care — from first greeting to the last shared slice.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 .008h.008v.008H15V9.758z" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="section-pad bg-charcoal">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="The PIAZZO difference"
            description="Four reasons guests return — craft in the kitchen, care at the table."
            light
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {reasons.map((item, i) => (
            <Reveal
              key={item.title}
              delay={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)}
            >
              <article className="group h-full rounded-[16px] border border-white/10 bg-[#1a1a1a] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1.5 hover:border-flame/30 hover:shadow-[0_16px_40px_rgba(226,43,32,0.12)] sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-flame/15 text-flame transition-colors duration-300 group-hover:bg-flame group-hover:text-white">
                  {item.icon}
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-outfit)] text-lg font-semibold tracking-tight text-[#f7f6f4] sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
