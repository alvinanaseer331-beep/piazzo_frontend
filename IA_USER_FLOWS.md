# BRASA — Information Architecture & User Flows v1.0

> Pre-UI product documentation for the BRASA customer website and admin dashboard.  
> Aligned with **BRASA Brand Guidelines & Design System v1.0**.  
> **No UI design or code until this IA is approved.**

---

## Document purpose

This document defines *what* the product contains, *how* users move through it, and *which* surfaces are shared — before wireframes or visual design. It is the source of truth for sitemap, navigation, page inventory, and critical commerce flows.

**Primary user goals**
1. Discover BRASA and decide to order
2. Build a customized order quickly
3. Pay with confidence
4. Track fulfillment until delivery or pickup
5. Return easily for reorder

**Secondary goals**
- Reserve a table / find a location
- Learn brand story and menu philosophy
- Manage account, addresses, and payment preferences
- Support staff operate orders via Admin

---

## 1. Complete sitemap

### 1.1 Public marketing & commerce site

```
BRASA.com
├── /                          Home (Landing)
├── /menu                      Menu index
│   ├── /menu/[category]       Category filtered view (optional route or query)
│   └── /menu/[item-slug]      Item detail / customize
├── /deals                     Deals & offers
├── /locations                 Store locator
│   └── /locations/[slug]      Individual store page
├── /about                     Our story / brand
├── /careers                   Careers (optional Phase 2)
├── /gift-cards                Gift cards (optional Phase 2)
├── /order                     Order hub (redirects into menu + cart context)
├── /cart                      Cart review
├── /checkout                  Checkout
│   ├── /checkout/details      Contact & fulfillment
│   ├── /checkout/payment      Payment
│   └── /checkout/review       Final review (can be single-page steps)
├── /order/confirmation/[id]   Order success
├── /order/track/[id]          Order tracking
├── /account                   Account home (auth required)
│   ├── /account/orders        Order history
│   ├── /account/orders/[id]   Past order detail / reorder
│   ├── /account/addresses     Saved addresses
│   ├── /account/payments      Saved payments (tokenized)
│   ├── /account/favorites     Favorite items
│   └── /account/settings      Profile & preferences
├── /auth/sign-in              Sign in
├── /auth/sign-up              Create account
├── /auth/forgot-password      Password recovery
├── /help                      Help center
│   └── /help/[article]        Help article
├── /contact                   Contact
├── /privacy                   Privacy policy
├── /terms                     Terms of service
└── /accessibility             Accessibility statement
```

### 1.2 Admin dashboard (staff / ops)

```
admin.brasa.com  (or /admin)
├── /login                     Admin authentication
├── /                          Ops overview (dashboard home)
├── /orders                    Live orders board
│   └── /orders/[id]           Order detail / status controls
├── /menu                      Menu management
│   ├── /menu/items            Items list
│   ├── /menu/items/[id]       Item edit
│   ├── /menu/categories       Categories
│   ├── /menu/modifiers        Modifier groups
│   └── /menu/availability     86 / sold-out controls
├── /deals                     Promotions management
├── /customers                 Customer lookup
│   └── /customers/[id]        Customer profile (orders, notes)
├── /locations                 Store settings
│   └── /locations/[id]        Hours, delivery zones, staff
├── /inventory                 Inventory / toppings (Phase 2)
├── /reports                   Sales & performance reports
├── /staff                     Staff users & roles
├── /settings                  Brand / store / tax / payments config
└── /help                      Internal ops help
```

### 1.3 Global overlays & system surfaces (not full pages)

| Surface | Type | Purpose |
|---|---|---|
| Cart drawer | Overlay | Quick cart review from any commerce page |
| Item customize modal / page | Modal or dedicated page | Size, crust, toppings, instructions |
| Location / fulfillment picker | Modal | Delivery vs pickup + address / store |
| Mobile nav sheet | Overlay | Primary navigation on small screens |
| Auth gate modal | Overlay | Optional sign-in during checkout |
| Toast / banner | System | Success, errors, store closed notices |

---

## 2. Customer journey

### 2.1 Journey stages (Awareness → Loyalty)

| Stage | User mindset | Key pages | Success signal |
|---|---|---|---|
| **1. Awareness** | “What is BRASA?” | Home, About, social entry | Brand recall + appetite |
| **2. Consideration** | “Is it worth ordering?” | Menu, Deals, Locations, Reviews on Home | Intent to order |
| **3. Decision** | “I’ll get pizza tonight” | Fulfillment picker, Menu | Store + mode selected |
| **4. Configuration** | “Build my order” | Item detail, Cart | Cart value > $0, valid items |
| **5. Commitment** | “Pay and confirm” | Checkout | Payment authorized |
| **6. Fulfillment** | “Where’s my food?” | Confirmation, Tracking | Status progresses |
| **7. Enjoyment** | Eat / share | — | On-time, correct order |
| **8. Retention** | “Order again” | Account, Reorder, Deals email/SMS | Repeat order within 30 days |

### 2.2 Primary personas (IA-relevant)

| Persona | Need | IA implication |
|---|---|---|
| **Hungry parent** | Fast family order, clear allergens, deals | Sticky Order CTA, simple modifiers, saved addresses |
| **Weeknight regular** | Reorder favorites fast | Account favorites + past orders |
| **First-time visitor** | Trust + appetite | Strong Home IA, social proof, transparent fees |
| **Pickup runner** | Choose store, ETA, ready notification | Locations + tracking pickup lane |
| **Store manager** | Clear live queue | Admin orders board as primary IA |

### 2.3 Journey entry points

- Organic / paid → Home or Deals
- Deep link → Item or Deal
- “Order now” QR in-store → Menu with location preselected
- Email/SMS track link → Tracking
- App bookmark → Account / Reorder

---

## 3. User flow: Landing → successful order

### 3.1 Happy path (guest or signed-in)

```
[Land on Home]
    │
    ├─► Tap "Order Now" (primary CTA)
    │
    ▼
[Fulfillment picker]
    │  Choose: Delivery OR Pickup
    │  Delivery → enter/confirm address → validate zone
    │  Pickup → select store
    │
    ▼
[Menu]
    │  Browse categories / deals
    │  Open item
    │
    ▼
[Customize item]
    │  Size, crust, toppings, qty, notes
    │  Add to cart
    │
    ▼
[Cart] (drawer or /cart)
    │  Edit qty / remove / add more
    │  See fees estimate (if address known)
    │  Proceed to checkout
    │
    ▼
[Checkout]
    │  Step A: Contact info (+ optional account create)
    │  Step B: Confirm fulfillment details & ETA window
    │  Step C: Tip, promo code, payment method
    │  Step D: Place order
    │
    ▼
[Payment authorization]
    │  Success → create order
    │  Fail → stay on payment with error + retry
    │
    ▼
[Order confirmation]
    │  Order ID, ETA, summary, Track CTA
    │
    ▼
[Order tracking]  ← ongoing until Delivered / Picked up
```

### 3.2 Alternate / exception paths

| Condition | System behavior | User path |
|---|---|---|
| Outside delivery zone | Block delivery, suggest pickup stores | Switch to pickup or change address |
| Store closed | Show next open time; disable Order | Browse menu read-only or schedule (if enabled) |
| Item 86’d mid-session | Remove/flag in cart | Replace item or continue without |
| Promo invalid | Inline error on code field | Remove code or fix |
| Payment declined | Error on payment step | Change method / retry |
| Auth preferred but guest allowed | Guest checkout available | Optional “Save order to account” after success |
| Empty cart on checkout URL | Redirect to Menu | Continue shopping |

### 3.3 Decision gates (must pass to continue)

1. Valid fulfillment mode + location/address  
2. Cart contains ≥1 available item  
3. Minimum order met (if store rule exists)  
4. Contact + phone valid  
5. Payment authorized  

---

## 4. Navigation structure

### 4.1 Information hierarchy (priority)

1. **Order** (commerce primary)  
2. **Menu**  
3. **Deals**  
4. **Locations**  
5. **About**  
6. **Account / Help** (utility)

### 4.2 Primary navigation (global header)

| Label | Destination | Notes |
|---|---|---|
| Menu | `/menu` | Always visible |
| Deals | `/deals` | Always visible |
| Locations | `/locations` | Always visible |
| About | `/about` | Desktop; may sit under “More” on tablet |
| Order Now | Fulfillment picker → Menu | Primary button (flame CTA) |

### 4.3 Utility navigation (header right)

| Control | Behavior |
|---|---|
| Location / mode chip | Opens fulfillment picker; shows “Delivery to … / Pickup at …” |
| Account | Sign in or `/account` |
| Cart | Opens cart drawer; badge = item count |
| Help | `/help` (desktop optional; footer on mobile) |

### 4.4 Secondary / contextual nav

- **Menu page:** category tabs or left rail (Desktop), horizontal chip scroller (Mobile)
- **Account:** side nav (Desktop), stacked list (Mobile)
- **Admin:** persistent left sidebar

### 4.5 Navigation rules

- “Order Now” is never buried  
- Active route indicated by weight/underline (per brand system)  
- Cart + fulfillment chip persist across Menu → Checkout (except Confirmation may simplify header)  
- Legal links never in primary nav  

---

## 5. Header and footer links

### 5.1 Header

**Left:** Wordmark `BRASA` → `/`  
**Center (Desktop):** Menu · Deals · Locations · About  
**Right:** Fulfillment chip · Account · Cart · **Order Now**

**Header states**
| Context | Header treatment |
|---|---|
| Home hero | Transparent / charcoal over imagery |
| Interior pages | Solid stone or white + bottom border |
| Checkout | Simplified: logo · secure checkout label · help link (minimize distraction) |
| Confirmation / Tracking | Logo · Account · Help |

### 5.2 Footer

**Column A — Brand**  
- Wordmark + short line  
- Social: Instagram, TikTok, Facebook, YouTube  

**Column B — Order**  
- Menu  
- Deals  
- Locations  
- Track order (`/order/track` entry with ID lookup)  

**Column C — Company**  
- About  
- Careers  
- Contact  
- Gift cards (if live)  

**Column D — Support**  
- Help center  
- Allergens & nutrition (Help article or `/help/allergens`)  
- Accessibility  

**Bottom bar**  
- © year BRASA  
- Privacy  
- Terms  
- Cookie preferences (if applicable)  

---

## 6. All website pages

### 6.1 Customer site page inventory

| ID | Page | URL | Auth | Primary job |
|---|---|---|---|---|
| P01 | Home | `/` | Public | Convert to Order |
| P02 | Menu | `/menu` | Public* | Browse & add items |
| P03 | Item customize | `/menu/[slug]` | Public* | Configure & add |
| P04 | Deals | `/deals` | Public* | Attach offer → Menu |
| P05 | Locations | `/locations` | Public | Find store / start pickup |
| P06 | Store detail | `/locations/[slug]` | Public | Hours, map, order from store |
| P07 | About | `/about` | Public | Trust & brand story |
| P08 | Cart | `/cart` | Public | Review before pay |
| P09 | Checkout | `/checkout` | Public (guest OK) | Complete purchase |
| P10 | Confirmation | `/order/confirmation/[id]` | Token/link | Reassure + next step |
| P11 | Track order | `/order/track/[id]` | Token/link | Status visibility |
| P12 | Track lookup | `/order/track` | Public | Find order by ID + phone |
| P13 | Sign in | `/auth/sign-in` | Public | Authenticate |
| P14 | Sign up | `/auth/sign-up` | Public | Create account |
| P15 | Forgot password | `/auth/forgot-password` | Public | Recover access |
| P16 | Account home | `/account` | Required | Hub for loyalty tasks |
| P17 | Order history | `/account/orders` | Required | Reorder |
| P18 | Order detail | `/account/orders/[id]` | Required | Receipt / reorder |
| P19 | Addresses | `/account/addresses` | Required | Manage delivery |
| P20 | Payments | `/account/payments` | Required | Manage methods |
| P21 | Favorites | `/account/favorites` | Required | Faster reorder |
| P22 | Settings | `/account/settings` | Required | Profile, marketing prefs |
| P23 | Help | `/help` | Public | Self-serve support |
| P24 | Help article | `/help/[slug]` | Public | Answer question |
| P25 | Contact | `/contact` | Public | Human support |
| P26 | Privacy | `/privacy` | Public | Legal |
| P27 | Terms | `/terms` | Public | Legal |
| P28 | Accessibility | `/accessibility` | Public | Legal / commitment |

\*Menu/Deals public to browse; ordering requires fulfillment selection before Add to Cart finalization (soft gate).

### 6.2 Admin page inventory (summary)

| ID | Page | Primary job |
|---|---|---|
| A01 | Dashboard home | KPIs + attention queue |
| A02 | Orders board | Live fulfillment management |
| A03 | Order detail | Status, items, customer contact |
| A04–A08 | Menu management set | Items, categories, modifiers, availability |
| A09 | Deals manager | Create/edit promos |
| A10–A11 | Customers | Lookup & notes |
| A12–A13 | Locations | Store ops config |
| A14 | Reports | Performance |
| A15 | Staff & roles | Access control |
| A16 | Settings | Tax, payments, brand config |

---

## 7. Every section inside each page

### P01 — Home
1. Global header  
2. Hero (brand-dominant, one headline, one supporting line, CTA group, full-bleed image)  
3. Featured deals strip (optional, below fold)  
4. Signature menu highlights (select items → Menu)  
5. How ordering works (3 steps max)  
6. Social proof / guest quotes  
7. Locations teaser (find a BRASA)  
8. About teaser (Born of Fire)  
9. Final CTA band (Order Now)  
10. Footer  

### P02 — Menu
1. Header + fulfillment chip  
2. Category navigation  
3. Deal callout (if applicable)  
4. Item grid/list by category  
5. Sticky mini-cart summary (mobile)  
6. Footer  

### P03 — Item customize
1. Item media  
2. Name, description, allergens summary  
3. Required options (size, crust)  
4. Optional modifiers (toppings, extras)  
5. Special instructions  
6. Quantity + price live total  
7. Add to cart CTA  
8. Related items (optional)  

### P04 — Deals
1. Hero/intro (short)  
2. Deal cards list  
3. Terms snippets  
4. CTA per deal → applies code / deep-links item  

### P05 — Locations
1. Search / detect location  
2. Map + list toggle  
3. Store cards (distance, hours, Order / Directions)  

### P06 — Store detail
1. Store name & status (open/closed)  
2. Hours  
3. Address + map  
4. Amenities (dine-in, parking)  
5. Order Pickup CTA  
6. Contact phone  

### P07 — About
1. Brand story hero  
2. Craft pillars (fermentation, fire, family table)  
3. Ingredient / sourcing narrative  
4. Team / community (optional)  
5. CTA Order  

### P08 — Cart
1. Line items (edit/remove)  
2. Upsell suggestions  
3. Promo code field  
4. Fee summary (subtotal; fees finalize in checkout)  
5. Checkout CTA  
6. Continue shopping  

### P09 — Checkout (single page with steps or multi-step)
1. Progress indicator  
2. Contact  
3. Fulfillment confirmation  
4. Order summary sidebar/sticky  
5. Promo / tip  
6. Payment  
7. Legal consent (terms)  
8. Place order  

### P10 — Confirmation
1. Success message + order ID  
2. ETA / pickup time  
3. Summary  
4. Track order CTA  
5. Create account prompt (if guest)  
6. Support link  

### P11 — Tracking
1. Status timeline  
2. Live ETA  
3. Driver / store progress (as applicable)  
4. Order summary  
5. Help / contact store  
6. Reorder (after complete)  

### P12 — Track lookup
1. Order ID field  
2. Phone verification field  
3. Find order CTA  

### P13–P15 — Auth
1. Form (email/password or magic link if supported)  
2. Alternate path links  
3. Trust note (privacy)  

### P16 — Account home
1. Greeting  
2. Quick actions: Reorder last · Favorites · Track active  
3. Recent orders  
4. Account nav  

### P17–P22 — Account subpages
- Lists + CRUD patterns for addresses/payments  
- Order cards with Reorder  
- Settings: name, phone, email, marketing toggles, delete account request  

### P23–P25 — Help / Contact
1. Search help  
2. Category topics  
3. Article body OR contact form  
4. Emergency: call store  

### P26–P28 — Legal
1. Title  
2. Last updated  
3. Structured policy content  

---

## 8. Reusable components across the website

### 8.1 Layout & navigation
- `AppHeader` / `SimplifiedCheckoutHeader`  
- `AppFooter`  
- `MobileNavSheet`  
- `AccountNav`  
- `AdminSidebar`  
- `PageContainer` (max-width 1200)  
- `Section` / `CTABand`  

### 8.2 Commerce
- `FulfillmentPicker`  
- `StoreCard` / `StoreStatusBadge`  
- `CategoryNav`  
- `MenuItemCard`  
- `ItemCustomizer` (options, modifiers, qty)  
- `AllergenTag` / `DietaryBadge`  
- `CartDrawer` / `CartLineItem`  
- `CartSummary`  
- `PromoCodeField`  
- `TipSelector`  
- `CheckoutProgress`  
- `OrderSummaryPanel`  
- `PaymentMethodForm`  

### 8.3 Order lifecycle
- `OrderStatusTimeline`  
- `OrderReceipt`  
- `TrackLookupForm`  
- `ReorderButton`  

### 8.4 Content & marketing
- `Hero` (brand-first)  
- `DealCard`  
- `TestimonialQuote`  
- `StepList` (how it works)  
- `LocationTeaser`  

### 8.5 Account & forms
- `AuthForm`  
- `AddressForm` / `AddressList`  
- `EmptyState`  
- `ConfirmDialog`  

### 8.6 Feedback & system
- `Toast`  
- `Banner` (store closed, out of zone)  
- `LoadingSkeleton`  
- `ErrorState` / `NotFound`  
- `Modal` / `Drawer` primitives  

### 8.7 Admin-specific
- `OrdersKanban` / `OrdersTable`  
- `StatusActionBar`  
- `MenuAvailabilityToggle`  
- `ReportChartFrame`  
- `StaffRoleEditor`  

---

## 9. Mobile navigation flow

### 9.1 Default mobile chrome
```
[ Header: Logo | Fulfillment chip | Cart ]
[ optional sticky Order Now under header on Home/Menu ]
[ Main content ]
[ Footer condensed ]
```

### 9.2 Opening primary nav
```
Tap Menu icon (hamburger)
  → MobileNavSheet slides up/full screen
      · Menu
      · Deals
      · Locations
      · About
      · Account / Sign in
      · Help
      · Order Now (primary button)
  Tap link → navigate + close sheet
  Tap overlay / close → dismiss
```

### 9.3 Mobile order shortcuts
1. **Order Now** → Fulfillment picker → Menu  
2. **Cart badge** → Cart drawer → Checkout  
3. **Fulfillment chip** → Change address/store anytime before payment  

### 9.4 Mobile checkout flow specifics
- Single-column steps  
- Order summary in expandable accordion  
- Sticky “Place order” in thumb zone  
- Native keyboard-friendly inputs  
- Apple Pay / Google Pay placement above card form when available  

### 9.5 Mobile account
- Account routes as stacked full pages (no persistent side nav)  
- Back link to Account home  

---

## 10. Admin dashboard sitemap

See §1.2 for tree. Navigation model:

```
Admin Sidebar
├── Overview
├── Orders ● (live count badge)
├── Menu
│   ├── Items
│   ├── Categories
│   ├── Modifiers
│   └── Availability
├── Deals
├── Customers
├── Locations
├── Reports
├── Staff
└── Settings
```

**Admin roles (IA access)**
| Role | Access |
|---|---|
| Super Admin | All |
| Store Manager | Orders, availability, deals (store-scoped), reports (store) |
| Crew Lead | Orders board + order detail only |
| Marketer | Deals + reports read |  

**Admin critical flow:** New order → Acknowledge → In preparation → Ready → Out for delivery / Picked up → Completed → (Cancel/Refund exception path)

---

## 11. Checkout flow

### 11.1 Preconditions
- Cart ≠ empty  
- Fulfillment selected & validated  
- All line items available  

### 11.2 Step model (logical; UI may be one page)

| Step | Name | Fields / actions | Exit criteria |
|---|---|---|---|
| C0 | Enter checkout | Load cart snapshot, lock prices preview | Snapshot loaded |
| C1 | Contact | Name, email, phone; guest vs sign-in | Valid contact |
| C2 | Fulfillment confirm | Address or store, instructions, ETA window | Valid & in zone / store open |
| C3 | Offers & tip | Promo code, tip %/custom | Optional; validate promo |
| C4 | Payment | Saved method / new card / wallet | Method token OK |
| C5 | Review & consent | Summary, terms checkbox if required | User confirms |
| C6 | Place order | Authorize payment + create order | Payment success + order ID |
| C7 | Redirect | → Confirmation | — |

### 11.3 Checkout business rules
- Show **itemized fees**: subtotal, delivery fee, tax, tip, discount  
- Minimum order enforced before C6  
- Phone required for delivery SMS updates  
- If store closes during checkout → block Place order + explain  
- Idempotent Place order (prevent double-charge on double tap)  

### 11.4 Checkout exit / abandon
- Back to Cart allowed before payment auth  
- Soft save cart in local session for return  
- Exit intent: no aggressive modals (brand restraint); optional discreet save  

---

## 12. Order tracking flow

### 12.1 Entry methods
1. Post-purchase redirect → `/order/confirmation/[id]` → Track CTA  
2. Email/SMS deep link → `/order/track/[id]?token=…`  
3. Manual → `/order/track` (Order ID + phone)  
4. Account → Active order card → Track  

### 12.2 Status model (customer-visible)

| Status | Delivery meaning | Pickup meaning |
|---|---|---|
| `received` | Order placed | Order placed |
| `preparing` | Kitchen working | Kitchen working |
| `ready` | Out for delivery soon / handed to courier | Ready for pickup |
| `en_route` | Courier on the way | — (skip) |
| `completed` | Delivered | Picked up |
| `cancelled` | Cancelled | Cancelled |

### 12.3 Tracking flow

```
[Enter tracking]
    │
    ▼
[Authorize access: token link OR ID + phone match]
    │
    ▼
[Show timeline + ETA + summary]
    │
    ├─ Updates via polling/websocket
    │
    ├─ If delivery + en_route → show courier progress (if available)
    ├─ If pickup + ready → emphasize “Ready · show code/name”
    │
    ▼
[completed] → Thank you · Reorder · Rate order (optional Phase 2)
[cancelled] → Reason (high level) · Help / Contact
```

### 12.4 Tracking rules
- PII-safe: no full address edit from tracking; contact store via masked channel if needed  
- ETA ranges, not false precision  
- Help CTA always visible  
- After `completed`, tracking remains read-only receipt for N days  

---

## Cross-flow map (summary)

```
Home ──Order Now──► Fulfillment ──► Menu ──► Customize ──► Cart
                                                      │
About / Deals / Locations ───────────────► Menu ──────┤
                                                      ▼
                                                 Checkout
                                                      │
                                                      ▼
                                               Confirmation
                                                      │
                                                      ▼
                                                 Tracking
                                                      │
                                                      ▼
                                              Account / Reorder
```

---

## Open decisions (resolve before UI)

1. Guest checkout only vs soft account prompts — **Recommend:** guest allowed + post-purchase save  
2. Item customize as modal vs page — **Recommend:** page on mobile, modal optional desktop  
3. Scheduled orders — Phase 1 out / Phase 2 in  
4. Multi-store cart — **Recommend:** single store per cart  
5. Real-time courier map — Phase 1 status timeline; map Phase 2  

---

## Acceptance criteria for this IA

- [ ] Every primary user goal maps to a page or flow above  
- [ ] Header/footer link sets are complete and non-duplicative  
- [ ] Checkout and tracking exception paths are defined  
- [ ] Admin can manage live orders without leaving Orders IA  
- [ ] Mobile nav can reach all primary destinations in ≤2 taps from sheet  
- [ ] Reusable component list is sufficient to start wireframes  

---

*BRASA IA & User Flows v1.0 — Pre-UI documentation · Aligned with Brand Guidelines v1.0*
