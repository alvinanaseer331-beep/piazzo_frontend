"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    q: "Do you take walk-ins?",
    a: "Yes. Walk-ins are welcome every day. For Friday and Saturday evenings we recommend a reservation to skip the wait.",
  },
  {
    q: "Is the dough vegan?",
    a: "Our classic dough is dairy-free. Several pizzas can be prepared vegan — ask your server for tonight’s options.",
  },
  {
    q: "How long does delivery take?",
    a: "Most neighborhood deliveries arrive in 30–45 minutes. You’ll get live tracking as soon as the pie leaves our oven.",
  },
  {
    q: "Can I host a private event?",
    a: "Absolutely. We host birthdays, team dinners, and intimate gatherings. Reach out on the Contact page with your date and headcount.",
  },
  {
    q: "Do you list allergens?",
    a: "Yes. Full allergen guides are available in-restaurant and on request before you order online.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad bg-stone">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before you arrive"
            description="Quick clarity on dining, dough, and delivery — so the only surprise is the first bite."
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3 lg:mt-16">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)}>
                <div className="overflow-hidden rounded-[12px] border border-line bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-mist/60 sm:px-6"
                  >
                    <span className="font-[family-name:var(--font-outfit)] text-base font-semibold text-charcoal sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-mist text-charcoal transition-transform duration-300 ${
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
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ash sm:px-6">
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
  );
}
