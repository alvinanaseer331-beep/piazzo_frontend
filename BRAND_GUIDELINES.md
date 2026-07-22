# BRASA — Brand Identity & Design System v1.0

> Premium international pizza brand. Original commercial identity.  
> Personality: premium · modern · energetic · family-friendly  
> **No page builds until this system is approved.**

---

## Brand one-liner

BRASA is the neighborhood pizza house that feels world-class: wood-fire craft, bright modern energy, and a table where everyone belongs.

**Wordmark:** `BRASA` (always uppercase)  
**Optional tagline:** Born of Fire.

---

## 1. Brand personality

| Trait | Meaning | Avoid |
|---|---|---|
| **Premium** | Quality materials, calm spacing, intentional photography | Luxury snobbery, gold-leaf gimmicks |
| **Modern** | Clean type, bold red, sharp hierarchy | Retro diner clichés, comic fonts |
| **Energetic** | Motion, flame red, strong CTAs | Neon overload, meme tone |
| **Family-friendly** | Welcoming copy, shared-table imagery | Childish mascots, cartoon clutter |

**Voice:** Direct · Optimistic · Craft-proud · Inclusive · Never fussy

**Core signals:** Fire (craft) · Table (hospitality) · Clarity (UI) · Appetite (visual goal)

---

## 2. Design philosophy

1. **One composition** — Heroes read as a single scene: brand, one line, one CTA, one image plane — not a dashboard of promos.
2. **Brand as hero** — BRASA dominates the first viewport. Headlines support the brand; they never outshine it.
3. **Appetite over ornament** — Real food photography is primary. Decorative gradients never replace the product.
4. **Commercial clarity** — International brand discipline: consistent tokens, reusable components, predictable patterns.
5. **Warmth through people** — Family energy from shared tables and honest moments — not stickers on photos.
6. **Restraint = premium** — Fewer elements, stronger hierarchy. If a border/shadow/card isn’t needed for interaction, remove it.

---

## 3. Color palette

Direction: charcoal authority + tomato flame energy + basil freshness.  
Avoids wine-burgundy / gold / cream restaurant clichés.

### Primary

| Token | HEX | Role |
|---|---|---|
| `brasa-flame` | `#E22B20` | Primary brand / CTAs / key accents |
| `brasa-charcoal` | `#121212` | Primary text, dark surfaces, nav |
| `brasa-stone` | `#F7F6F4` | Page background (cool stone, not cream) |
| `brasa-white` | `#FFFFFF` | Cards, forms, elevated surfaces |

### Secondary

| Token | HEX | Role |
|---|---|---|
| `brasa-basil` | `#2F6B4F` | Freshness, success, secondary accents |
| `brasa-ash` | `#6B6B6B` | Muted body, captions, meta |
| `brasa-ember` | `#C41E16` | Hover / pressed flame |
| `brasa-ink` | `#2A2A2A` | Secondary dark for soft contrast |

### System

| Token | HEX | Role |
|---|---|---|
| `brasa-line` | `#E4E2DE` | Borders, dividers |
| `brasa-mist` | `#EEECEA` | Input fill, zebra rows |
| `brasa-success` | `#2F6B4F` | Confirmations |
| `brasa-warning` | `#C47A12` | Alerts (sparingly) |
| `brasa-error` | `#B42318` | Errors |
| `brasa-info` | `#2F5D8A` | Informational |

**Usage mix (marketing pages):** ~55% stone/white · ~25% charcoal · ~15% flame · ~5% basil. Never flood a page with red.

---

## 4. Typography

| Role | Family | Notes |
|---|---|---|
| **Headings** | **Outfit** | Geometric sans; weights 500 / 600 / 700; tracking `-0.02em` on XL display |
| **Body / UI** | **Plus Jakarta Sans** | Weights 400 / 500 / 600; LH 1.55–1.7 paragraphs |

**Fallbacks:** `system-ui, Segoe UI, sans-serif`

| Style | Size / LH | Usage |
|---|---|---|
| Display | 56–72px / 1.05 | Hero brand moments |
| H1 | 40–48px / 1.15 | Page heroes |
| H2 | 32–36px / 1.2 | Section titles |
| H3 | 24–28px / 1.25 | Subsections / card titles |
| Body L | 18px / 1.65 | Lead paragraphs |
| Body | 16px / 1.6 | Default copy |
| Body S | 14px / 1.5 | Captions, meta, legal |
| Overline | 12px / 1.4 · 600 · 0.08em | Section labels (rare) |

---

## 5. Button styles

| Variant | Visual | When |
|---|---|---|
| **Primary** | bg `#E22B20` · text `#fff` · radius 12 · pad 14×28 · weight 600 | Order Now, Add to Cart, Checkout |
| **Primary hover** | bg `#C41E16` · `translateY(-1px)` | Desktop hover |
| **Secondary** | transparent · border 1.5px `#121212` · text charcoal | View Menu, Learn More |
| **Ghost** | no border · text flame · underline on hover | Inline actions |
| **Dark surface** | bg `#fff` · text `#121212` | CTAs on dark heroes |
| **Destructive** | bg `#B42318` · text `#fff` | Remove / cancel |

- Min height **48px** on mobile  
- **Never** `border-radius: 9999px` on buttons (avatars only)  
- Icon-only controls require `aria-label`

---

## 6. Border radius system

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 4px | Tags, chips, checkboxes |
| `radius-sm` | 8px | Inputs, small controls |
| `radius-md` | **12px** | Buttons, menu cards, default UI (signature) |
| `radius-lg` | 16px | Feature panels, modals |
| `radius-xl` | 24px | Large media frames (sparingly) |
| `radius-full` | 9999px | Avatars only |

---

## 7. Shadow system

| Token | Value | Usage |
|---|---|---|
| `shadow-none` | none | Default for most surfaces |
| `shadow-sm` | `0 1px 2px rgba(18,18,18,0.06)` | Subtle resting cards |
| `shadow-md` | `0 8px 24px rgba(18,18,18,0.08)` | Hover, dropdowns |
| `shadow-lg` | `0 16px 40px rgba(18,18,18,0.12)` | Modals, drawers |
| `shadow-flame` | `0 8px 20px rgba(226,43,32,0.25)` | Primary CTA hover only |

Prefer borders (`#E4E2DE`) over heavy shadows. **No glow effects.**

---

## 8. Spacing system

**Base unit:** 4px  
**Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

| Token | Value | Common use |
|---|---|---|
| `space-1` | 4px | Tight icon gaps |
| `space-2` | 8px | Label ↔ input |
| `space-3` | 12px | Chip groups |
| `space-4` | 16px | Compact card padding |
| `space-5` | 24px | Default card padding |
| `space-6` | 32px | Component gaps |
| `space-7` | 48px | Section inner spacing |
| `space-8` | 64px | Section padding (tablet) |
| `space-9` | 96px | Section padding (desktop) |

- Content max-width: **1200px**  
- Gutters: 16 mobile · 24 tablet · 32–48 desktop  
- Section gaps: 80–120px desktop · 56–72px mobile  

---

## 9. Icon style

- Stroke icons, **1.75–2px** weight  
- Rounded joins/caps  
- **20px** default UI · **24px** feature  
- Color inherits text; active = flame or basil  
- Geometry aligned with Lucide / Phosphor  
- **Do:** sparse pizza, oven, delivery, clock, map  
- **Don’t:** emoji icons, 3D icons, rainbow icon rows, mascot stickers  

---

## 10. Card design

Cards are **not** default chrome. Use only for interactive surfaces (menu item, cart, selectable deal) or form grouping.

| Property | Spec |
|---|---|
| Background | `#FFFFFF` on stone page |
| Border | `1px solid #E4E2DE` (preferred over shadow at rest) |
| Radius | 12px |
| Padding | 24px default · 16px compact |
| Hover | darker border + `shadow-md` · image scale 1.03 |
| Media | Edge-to-edge top image; matching top radius only |
| Price | Right-aligned, weight 600, charcoal — never gold |
| Forbidden | Glassmorphism, colored left bars, badge sticker piles |

---

## 11. Form input design

| State | Spec |
|---|---|
| Default | bg `#EEECEA` · border 1px `#E4E2DE` · radius 8 · h 48 · px 16 |
| Focus | bg `#fff` · border 1.5px `#E22B20` · no thick glow |
| Error | border `#B42318` · helper 14px error |
| Disabled | opacity 0.5 |
| Label | 14px · 500 · charcoal · 8px above |
| Helper | 12–14px · ash · below |
| Textarea | same tokens · min-height 120 |

Mobile: single column. Desktop: two columns only for short paired fields.

---

## 12. Animation guidelines

| Motion | Timing | Usage |
|---|---|---|
| Fade + rise | 400–600ms ease-out | Section enter (once) |
| Hover lift | 200ms ease | Cards / primary button |
| Subtle ken-burns | 8–12s | Hero only |
| Menu swap | 250ms ease-in-out | Category filters |
| Cart drawer | 300ms cubic-bezier(.22,1,.36,1) | Slide from right |
| Reduced motion | `prefers-reduced-motion` | Disable travel |

Ship **2–3 intentional motions** per major page. No bounce loops, particle fire, or scroll-jacking.

---

## 13. Image style guidelines

| Rule | Detail |
|---|---|
| Subject | Real pizza, ovens, ingredients, shared tables |
| Light | Warm practical light; visible crust texture; no heavy Instagram filters |
| Crop | Heroes full-bleed; product 4:3 or 1:1; lifestyle 16:9 |
| People | Diverse families mid-bite; candid over posed luxury |
| Overlay | Soft charcoal gradient for type only — no floating badges on food |
| Quality | Sharp cheese pull / crust detail; never blurry food |

---

## 14. Illustration style

- Prefer photography; illustrations rare (empty states, delivery status, loyalty)  
- Flat vector, 2–3 colors max (flame, charcoal, basil)  
- Geometric, slightly rounded — aligned with Outfit  
- No comic outlines, 3D clay, or sticker packs  
- Line weight matches icon system  

---

## 15. UI component style

| Component | Direction |
|---|---|
| Navigation | Sticky charcoal / translucent on heroes; stone + border after scroll on light pages |
| Tabs / filters | Underline or weight active in flame — not pill clusters |
| Badges | Small `radius-xs` tags; one per card max |
| Modals | Centered, `radius-lg`, `shadow-lg`, 40% charcoal backdrop |
| Toasts | Charcoal bg, white text; basil accent bar for success |
| Footer | Charcoal full-bleed; compact links; flame wordmark accent |
| Price list | Clean rows + hairline dividers; avoid nesting entire menus in card grids |

---

## 16. Overall visual language

BRASA looks like a top-tier international pizza chain that still feels locally loved:

- **Flame red** → energy & appetite  
- **Charcoal** → confidence  
- **Stone** → bright commercial pages  
- **Basil** → freshness (accent only)  
- Photography carries emotion · Type carries clarity · UI stays out of the way  

**Signature moves:** full-bleed food heroes · flame CTAs · Outfit display · 12px corners  

**Never:** purple/indigo themes · cream+terracotta defaults · gold luxury clichés · broadsheet layouts  

**Emotional target:** “I want to order tonight — and bring the kids — and it still feels special.”

---

## 17. Desktop, tablet & mobile principles

| Breakpoint | Range | Principles |
|---|---|---|
| **Mobile** | `< 768px` | Single column · sticky Order CTA · full-bleed heroes · thumb-zone actions · nav sheet · type ~15–20% smaller |
| **Tablet** | `768–1024px` | 2-col menu grids · story + image side-by-side · generous padding · avoid 4-up cards |
| **Desktop** | `> 1024px` | max-width 1200px · strong L/R compositions · hover states · larger display type · 96px section rhythm |

**Cross-device**

- Touch targets ≥ 44×44px  
- No hover-only critical actions  
- Art-directed image crops per breakpoint when possible  
- Same tokens; change density, not personality  
- Validate order flow at **375px** before shipping  

---

## Implementation note

Next step (when approved): map tokens → CSS variables + shared UI primitives, then build pages against this system only.
