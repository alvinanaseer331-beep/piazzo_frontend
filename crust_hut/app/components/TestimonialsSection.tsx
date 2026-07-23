import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const reviews = [
  {
    quote:
      "The crust alone is worth the trip — airy, blistered, and somehow still delicate. PIAZZO ruined delivery pizza for us.",
    name: "Amelia Chen",
    role: "Local guide",
  },
  {
    quote:
      "We bring the kids every Friday. Staff remembers our order, the room feels warm, and the Diavola is perfect heat.",
    name: "Marcus & Lena",
    role: "Family regulars",
  },
  {
    quote:
      "International-caliber pizza without the pretension. The Burrata Inferno special stopped our conversation mid-sentence.",
    name: "Diego Alvarez",
    role: "Food editor",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-flame" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="section-pad bg-stone">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Guest Love"
            title="Words from our table"
            description="Thousands of five-star moments — here are a few that stay with us."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
              <blockquote className="flex h-full flex-col rounded-[12px] border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(18,18,18,0.08)]">
                <Stars />
                <p className="mt-5 flex-1 font-[family-name:var(--font-outfit)] text-lg leading-relaxed text-charcoal">
                  “{review.quote}”
                </p>
                <footer className="mt-6 border-t border-line pt-5">
                  <cite className="not-italic">
                    <span className="block font-semibold text-charcoal">
                      {review.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-ash">
                      {review.role}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
