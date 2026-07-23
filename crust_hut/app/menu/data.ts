/**
 * UI view-models for the menu page.
 * Mapped from API Category / MenuItem (see API.md).
 * Fields like rating/prepTime/dietary are UI defaults — not provided by the API.
 */

import type { Category as ApiCategory, MenuItem as ApiMenuItem } from "../lib/types";
import { parseMoney } from "../lib/services";

export type DietaryTag = "veg" | "chicken" | "none";

export type MenuItem = {
  id: string;
  apiId: number;
  categoryId: number;
  categorySlug: string;
  category: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  prepTime: string;
  dietary: DietaryTag;
  popular: boolean;
  image: string;
  imageAlt: string;
};

export type MenuCategoryTab = {
  id: string;
  label: string;
  apiId: number | null;
};

export const FALLBACK_MENU_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=85";

/**
 * Frontend display overrides for Fresh Juices only.
 * Some API image_url values resolve to non-juice photos; keep Pizza/Drinks untouched.
 */
const FRESH_JUICE_IMAGES: Record<string, string> = {
  "fresh-orange-juice":
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&q=85",
  "green-detox-juice":
    "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=900&q=85",
  "mango-sunrise":
    "https://images.unsplash.com/photo-1546173159-315724a31696?w=900&q=85",
  "watermelon-cooler":
    "https://images.unsplash.com/photo-1680954464671-6191ab264214?w=900&q=85",
  "pomegranate-boost":
    "https://images.unsplash.com/photo-1638838474698-3139f399bdf1?w=900&q=85",
  "berry-blast-juice":
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900&q=85",
};

/** Known pizza / non-juice Unsplash IDs that must never appear on juice cards */
const BLOCKED_JUICE_IMAGE_FRAGMENTS = [
  "photo-1513104890138-7c749659a591", // pizza fallback
  "photo-1623065422902-30a2d94be723", // incorrect mango (pizza)
  "photo-1624517452488-04869289c4ca", // soda can
  "photo-1683166263544-e754e85c3e7c", // watermelon extreme close-up
  "photo-1663955706695-de874fa93c4d", // pomegranate dark splash
];

function resolveMenuImage(
  item: ApiMenuItem,
  categorySlug: string | undefined,
): string {
  if (categorySlug === "fresh-juices") {
    const bySlug = item.slug ? FRESH_JUICE_IMAGES[item.slug] : undefined;
    if (bySlug) return bySlug;
    const url = item.image_url || "";
    if (
      !url ||
      BLOCKED_JUICE_IMAGE_FRAGMENTS.some((frag) => url.includes(frag))
    ) {
      return FRESH_JUICE_IMAGES["fresh-orange-juice"];
    }
  }
  return item.image_url || FALLBACK_MENU_IMAGE;
}

export function mapCategoryTabs(categories: ApiCategory[]): MenuCategoryTab[] {
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  return [
    { id: "all", label: "All", apiId: null },
    ...sorted.map((c) => ({
      id: c.slug || String(c.id),
      label: c.name,
      apiId: c.id,
    })),
  ];
}

export function mapMenuItem(
  item: ApiMenuItem,
  categoryById: Map<number, ApiCategory>,
): MenuItem {
  const cat = categoryById.get(item.category_id);
  const categorySlug = cat?.slug ?? String(item.category_id);
  return {
    id: String(item.id),
    apiId: item.id,
    categoryId: item.category_id,
    categorySlug,
    category: categorySlug,
    name: item.name,
    description: item.description ?? "",
    price: parseMoney(item.price),
    rating: item.is_featured ? 4.9 : 4.6,
    prepTime: "25–35 min",
    dietary: "none",
    popular: item.is_featured,
    image: resolveMenuImage(item, cat?.slug),
    imageAlt: item.name,
  };
}

export const FALLBACK_CATEGORIES: ApiCategory[] = [
  {
    id: 1,
    name: "Pizza",
    slug: "pizza",
    description: "Wood-fired pizzas stretched by hand and finished in the flame.",
    image_url: null,
    is_active: true,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Drinks",
    slug: "drinks",
    description: "Soft drinks, coffee, and sparkling refreshers.",
    image_url: null,
    is_active: true,
    sort_order: 2,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Fresh Juices",
    slug: "fresh-juices",
    description: "Cold-pressed juices made fresh to order.",
    image_url: null,
    is_active: true,
    sort_order: 3,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const NOW = "2026-01-01T00:00:00Z";

export const FALLBACK_MENU_ITEMS: ApiMenuItem[] = [
  // Pizza (6 items)
  {
    id: 1,
    category_id: 1,
    name: "Margherita Classica",
    slug: "margherita-classica",
    description: "San Marzano tomato, fior di latte mozzarella, fresh basil, and extra-virgin olive oil.",
    price: "14.99",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85",
    is_available: true,
    is_featured: true,
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 2,
    category_id: 1,
    name: "Pepperoni Inferno",
    slug: "pepperoni-inferno",
    description: "Spicy cupping pepperoni, mozzarella, and hot honey drizzle over a blistered crust.",
    price: "17.99",
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=85",
    is_available: true,
    is_featured: true,
    sort_order: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 3,
    category_id: 1,
    name: "Truffle Forest",
    slug: "truffle-forest",
    description: "Black truffle cream, wild mushrooms, mozzarella, thyme, and shaved parmesan.",
    price: "22.99",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85",
    is_available: true,
    is_featured: true,
    sort_order: 3,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 4,
    category_id: 1,
    name: "Prosciutto Arugula",
    slug: "prosciutto-arugula",
    description: "Parma ham, lemon-dressed arugula, mozzarella, and aged Parmigiano-Reggiano.",
    price: "19.99",
    image_url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 5,
    category_id: 1,
    name: "Four Cheese Quattro",
    slug: "four-cheese-quattro",
    description: "Mozzarella, gorgonzola, fontina, and pecorino baked until molten and golden.",
    price: "18.49",
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 5,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 6,
    category_id: 1,
    name: "Burrata Mediterranean",
    slug: "burrata-mediterranean",
    description: "Creamy burrata, sun-dried tomatoes, basil pesto, pine nuts, and aged balsamic glaze.",
    price: "20.99",
    image_url: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 6,
    created_at: NOW,
    updated_at: NOW,
  },

  // Drinks (6 items)
  {
    id: 7,
    category_id: 2,
    name: "Classic Cola",
    slug: "classic-cola",
    description: "Ice-cold cola served with fresh lemon — crisp and refreshing.",
    price: "2.99",
    image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 8,
    category_id: 2,
    name: "Sparkling Lemon Soda",
    slug: "sparkling-lemon-soda",
    description: "Bright citrus soda with real lemon and a clean fizzy finish.",
    price: "3.49",
    image_url: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 9,
    category_id: 2,
    name: "House Espresso",
    slug: "house-espresso",
    description: "Double shot of freshly pulled espresso with a rich crema.",
    price: "3.99",
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85",
    is_available: true,
    is_featured: true,
    sort_order: 3,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 10,
    category_id: 2,
    name: "Mint Sparkler",
    slug: "mint-sparkler",
    description: "Sparkling water with crushed mint, lime, and a hint of cane sugar.",
    price: "4.49",
    image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 11,
    category_id: 2,
    name: "Still Mineral Water",
    slug: "still-mineral-water",
    description: "Chilled bottled mineral water — perfect alongside a hot pie.",
    price: "2.49",
    image_url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 5,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 12,
    category_id: 2,
    name: "Iced Peach Tea",
    slug: "iced-peach-tea",
    description: "Slow-brewed black tea infused with sweet peach nectar and fresh mint.",
    price: "3.99",
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 6,
    created_at: NOW,
    updated_at: NOW,
  },

  // Fresh Juices (6 items)
  {
    id: 13,
    category_id: 3,
    name: "Fresh Orange Juice",
    slug: "fresh-orange-juice",
    description: "Cold-pressed oranges, served over ice with no added sugar.",
    price: "4.99",
    image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&q=85",
    is_available: true,
    is_featured: true,
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 14,
    category_id: 3,
    name: "Green Detox Juice",
    slug: "green-detox-juice",
    description: "Kale, apple, cucumber, and lemon — bright, clean, and energizing.",
    price: "5.99",
    image_url: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 15,
    category_id: 3,
    name: "Mango Sunrise",
    slug: "mango-sunrise",
    description: "Ripe mango blended with a splash of orange for a tropical finish.",
    price: "5.49",
    image_url: "https://images.unsplash.com/photo-1546173159-315724a31696?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 3,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 16,
    category_id: 3,
    name: "Watermelon Cooler",
    slug: "watermelon-cooler",
    description: "Fresh watermelon juice with mint — light, sweet, and ice-cold.",
    price: "4.79",
    image_url: "https://images.unsplash.com/photo-1680954464671-6191ab264214?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 17,
    category_id: 3,
    name: "Pomegranate Boost",
    slug: "pomegranate-boost",
    description: "Tart pomegranate juice with a squeeze of citrus for balance.",
    price: "5.79",
    image_url: "https://images.unsplash.com/photo-1638838474698-3139f399bdf1?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 5,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 18,
    category_id: 3,
    name: "Berry Blast Juice",
    slug: "berry-blast-juice",
    description: "Cold-pressed strawberries, raspberries, and blueberries with a twist of lime.",
    price: "5.99",
    image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900&q=85",
    is_available: true,
    is_featured: false,
    sort_order: 6,
    created_at: NOW,
    updated_at: NOW,
  },
];
