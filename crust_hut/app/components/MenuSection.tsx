import Image from "next/image";
import Reveal from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const menu = [
  {
    name: "Bianca Verde",
    price: "$20",
    desc: "Garlic cream, spinach, ricotta, lemon zest",
    image:
      "https://images.unsplash.com/photo-1571407970349-48dbaf252d15?w=700&q=80",
  },
  {
    name: "Pepperoni Heritage",
    price: "$19",
    desc: "Cupped pepperoni, mozzarella, oregano, hot honey",
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=700&q=80",
  },
  {
    name: "Four Cheese Vault",
    price: "$22",
    desc: "Mozzarella, gorgonzola, fontina, pecorino",
    image:
      "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=700&q=80",
  },
];

export default function MenuSection() {
  return (
    <section id="menu" className="section-pad bg-stone">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Full Flame Menu"
            title="More pies worth the fire"
            description="A tighter list, finished with intention. Ask your server about seasonal specials."
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-3">
          {menu.map((item, i) => (
            <Reveal key={item.name} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
              <article className="group">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[12px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="img-zoom object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3 border-b border-line pb-4">
                  <h3 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-charcoal">
                    {item.name}
                  </h3>
                  <span className="text-sm font-semibold text-flame">{item.price}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ash">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <a href="#bestsellers" className="btn-primary">
              Start Your Order
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
