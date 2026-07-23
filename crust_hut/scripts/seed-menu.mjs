/**
 * Idempotent seed of PIAZZO demo menu (15 items across Pizza, Drinks, Fresh Juices).
 * Run: node scripts/seed-menu.mjs
 */
const API = process.env.API_BASE || "http://localhost:8000";

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg =
      typeof body?.detail === "string"
        ? body.detail
        : JSON.stringify(body?.detail || body || res.statusText);
    const err = new Error(`${options.method || "GET"} ${path} → ${res.status}: ${msg}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

const CATEGORIES = [
  {
    name: "Pizza",
    slug: "pizza",
    description: "Wood-fired pizzas stretched by hand and finished in the flame.",
    sort_order: 1,
  },
  {
    name: "Drinks",
    slug: "drinks",
    description: "Soft drinks, coffee, and sparkling refreshers.",
    sort_order: 2,
  },
  {
    name: "Fresh Juices",
    slug: "fresh-juices",
    description: "Cold-pressed juices made fresh to order.",
    sort_order: 3,
  },
];

/** @type {Record<string, Array<{name:string,slug:string,description:string,price:string,image_url:string,is_featured:boolean,sort_order:number}>>} */
const ITEMS_BY_CATEGORY = {
  pizza: [
    {
      name: "Margherita Classica",
      slug: "margherita-classica",
      description:
        "San Marzano tomato, fior di latte mozzarella, fresh basil, and extra-virgin olive oil.",
      price: "14.99",
      image_url:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85",
      is_featured: true,
      sort_order: 1,
    },
    {
      name: "Pepperoni Inferno",
      slug: "pepperoni-inferno",
      description:
        "Spicy cupping pepperoni, mozzarella, and hot honey drizzle over a blistered crust.",
      price: "17.99",
      image_url:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=85",
      is_featured: true,
      sort_order: 2,
    },
    {
      name: "Truffle Forest",
      slug: "truffle-forest",
      description:
        "Black truffle cream, wild mushrooms, mozzarella, thyme, and shaved parmesan.",
      price: "22.99",
      image_url:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85",
      is_featured: true,
      sort_order: 3,
    },
    {
      name: "Prosciutto Arugula",
      slug: "prosciutto-arugula",
      description:
        "Parma ham, lemon-dressed arugula, mozzarella, and aged Parmigiano-Reggiano.",
      price: "19.99",
      image_url:
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900&q=85",
      is_featured: false,
      sort_order: 4,
    },
    {
      name: "Four Cheese Quattro",
      slug: "four-cheese-quattro",
      description:
        "Mozzarella, gorgonzola, fontina, and pecorino baked until molten and golden.",
      price: "18.49",
      image_url:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=85",
      is_featured: false,
      sort_order: 5,
    },
    {
      name: "Burrata Mediterranean",
      slug: "burrata-mediterranean",
      description:
        "Creamy burrata, sun-dried tomatoes, basil pesto, pine nuts, and aged balsamic glaze.",
      price: "20.99",
      image_url:
        "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900&q=85",
      is_featured: false,
      sort_order: 6,
    },
  ],
  drinks: [
    {
      name: "Classic Cola",
      slug: "classic-cola",
      description: "Ice-cold cola served with fresh lemon — crisp and refreshing.",
      price: "2.99",
      image_url:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=900&q=85",
      is_featured: false,
      sort_order: 1,
    },
    {
      name: "Sparkling Lemon Soda",
      slug: "sparkling-lemon-soda",
      description: "Bright citrus soda with real lemon and a clean fizzy finish.",
      price: "3.49",
      image_url:
        "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=900&q=85",
      is_featured: false,
      sort_order: 2,
    },
    {
      name: "House Espresso",
      slug: "house-espresso",
      description: "Double shot of freshly pulled espresso with a rich crema.",
      price: "3.99",
      image_url:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85",
      is_featured: true,
      sort_order: 3,
    },
    {
      name: "Mint Sparkler",
      slug: "mint-sparkler",
      description: "Sparkling water with crushed mint, lime, and a hint of cane sugar.",
      price: "4.49",
      image_url:
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=85",
      is_featured: false,
      sort_order: 4,
    },
    {
      name: "Still Mineral Water",
      slug: "still-mineral-water",
      description: "Chilled bottled mineral water — perfect alongside a hot pie.",
      price: "2.49",
      image_url:
        "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&q=85",
      is_featured: false,
      sort_order: 5,
    },
    {
      name: "Iced Peach Tea",
      slug: "iced-peach-tea",
      description: "Slow-brewed black tea infused with sweet peach nectar and fresh mint.",
      price: "3.99",
      image_url:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&q=85",
      is_featured: false,
      sort_order: 6,
    },
  ],
  "fresh-juices": [
    {
      name: "Fresh Orange Juice",
      slug: "fresh-orange-juice",
      description: "Cold-pressed oranges, served over ice with no added sugar.",
      price: "4.99",
      image_url:
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&q=85",
      is_featured: true,
      sort_order: 1,
    },
    {
      name: "Green Detox Juice",
      slug: "green-detox-juice",
      description: "Kale, apple, cucumber, and lemon — bright, clean, and energizing.",
      price: "5.99",
      image_url:
        "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=900&q=85",
      is_featured: false,
      sort_order: 2,
    },
    {
      name: "Mango Sunrise",
      slug: "mango-sunrise",
      description: "Ripe mango blended with a splash of orange for a tropical finish.",
      price: "5.49",
      image_url:
        "https://images.unsplash.com/photo-1623065422902-30a2d94be723?w=900&q=85",
      is_featured: false,
      sort_order: 3,
    },
    {
      name: "Watermelon Cooler",
      slug: "watermelon-cooler",
      description: "Fresh watermelon juice with mint — light, sweet, and ice-cold.",
      price: "4.79",
      image_url:
        "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=900&q=85",
      is_featured: false,
      sort_order: 4,
    },
    {
      name: "Pomegranate Boost",
      slug: "pomegranate-boost",
      description: "Tart pomegranate juice with a squeeze of citrus for balance.",
      price: "5.79",
      image_url:
        "https://images.unsplash.com/photo-1546173159-315724a31696?w=900&q=85",
      is_featured: false,
      sort_order: 5,
    },
    {
      name: "Berry Blast Juice",
      slug: "berry-blast-juice",
      description: "Cold-pressed strawberries, raspberries, and blueberries with a twist of lime.",
      price: "5.99",
      image_url:
        "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900&q=85",
      is_featured: false,
      sort_order: 6,
    },
  ],
};

const KEEP_CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
const KEEP_ITEM_SLUGS = new Set(
  Object.values(ITEMS_BY_CATEGORY)
    .flat()
    .map((i) => i.slug),
);

async function ensureCategory(def) {
  const list = await api("/api/v1/categories?limit=100");
  const existing =
    list.items.find((c) => c.slug === def.slug) ||
    list.items.find((c) => c.name.toLowerCase() === def.name.toLowerCase());

  if (existing) {
    const updated = await api(`/api/v1/categories/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: def.name,
        slug: def.slug,
        description: def.description,
        is_active: true,
        sort_order: def.sort_order,
      }),
    });
    console.log(`Category OK  ${updated.name} (id=${updated.id})`);
    return updated;
  }

  const created = await api("/api/v1/categories", {
    method: "POST",
    body: JSON.stringify({
      name: def.name,
      slug: def.slug,
      description: def.description,
      is_active: true,
      sort_order: def.sort_order,
    }),
  });
  console.log(`Category NEW ${created.name} (id=${created.id})`);
  return created;
}

async function deactivateOtherCategories(keepIds) {
  const list = await api("/api/v1/categories?limit=100");
  for (const cat of list.items) {
    if (keepIds.has(cat.id)) continue;
    if (!KEEP_CATEGORY_SLUGS.has(cat.slug)) {
      await api(`/api/v1/categories/${cat.id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: false }),
      });
      console.log(`Category OFF ${cat.name} (id=${cat.id})`);
    }
  }
}

async function ensureItem(categoryId, def) {
  const list = await api("/api/v1/menu-items?limit=100");
  const existing =
    list.items.find((i) => i.slug === def.slug) ||
    list.items.find(
      (i) =>
        i.name.toLowerCase() === def.name.toLowerCase() &&
        i.category_id === categoryId,
    );

  const payload = {
    name: def.name,
    slug: def.slug,
    description: def.description,
    price: def.price,
    category_id: categoryId,
    image_url: def.image_url,
    is_available: true,
    is_featured: def.is_featured,
    sort_order: def.sort_order,
  };

  if (existing) {
    const updated = await api(`/api/v1/menu-items/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    console.log(`  Item OK  ${updated.name}`);
    return updated;
  }

  const created = await api("/api/v1/menu-items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log(`  Item NEW ${created.name}`);
  return created;
}

async function deactivateOtherItems(keepIds) {
  const list = await api("/api/v1/menu-items?limit=100");
  for (const item of list.items) {
    if (keepIds.has(item.id)) continue;
    if (!KEEP_ITEM_SLUGS.has(item.slug)) {
      try {
        await api(`/api/v1/menu-items/${item.id}`, {
          method: "PUT",
          body: JSON.stringify({ is_available: false }),
        });
        console.log(`  Item OFF ${item.name} (id=${item.id})`);
      } catch (e) {
        console.warn(`  Could not deactivate ${item.name}: ${e.message}`);
      }
    }
  }
}

async function main() {
  console.log(`Seeding menu via ${API}\n`);

  const categoryMap = {};
  for (const def of CATEGORIES) {
    const cat = await ensureCategory(def);
    categoryMap[def.slug] = cat;
  }

  await deactivateOtherCategories(
    new Set(Object.values(categoryMap).map((c) => c.id)),
  );

  const createdIds = new Set();
  for (const [slug, items] of Object.entries(ITEMS_BY_CATEGORY)) {
    const cat = categoryMap[slug];
    console.log(`\nSeeding ${cat.name}…`);
    for (const def of items) {
      const item = await ensureItem(cat.id, def);
      createdIds.add(item.id);
    }
  }

  await deactivateOtherItems(createdIds);

  const available = await api(
    "/api/v1/menu-items?is_available=true&limit=100",
  );
  const all = await api("/api/v1/menu-items?limit=100");

  console.log("\n=== VERIFY ===");
  console.log(`Available menu items: ${available.total}`);
  console.log(`All menu items (incl. inactive): ${all.total}`);

  const byCat = {};
  for (const item of available.items) {
    const key = item.category_id;
    byCat[key] = (byCat[key] || 0) + 1;
  }
  for (const [slug, cat] of Object.entries(categoryMap)) {
    console.log(
      `  ${cat.name}: ${byCat[cat.id] || 0} available (expected 6)`,
    );
  }

  available.items
    .sort((a, b) => a.category_id - b.category_id || a.sort_order - b.sort_order)
    .forEach((i) => {
      console.log(
        `  - [${i.id}] ${i.name} $${i.price} featured=${i.is_featured}`,
      );
    });

  if (available.total !== 18 || available.items.length !== 18) {
    console.error(
      `\nFAIL: expected 18 available items, got total=${available.total} length=${available.items.length}`,
    );
    process.exit(1);
  }

  console.log("\nSUCCESS: GET /api/v1/menu-items returns 18 available items.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
