# PIAZZO Frontend ↔ FastAPI Integration Report

**Date:** 2026-07-15  
**Frontend:** `http://localhost:3000` (Next.js 16)  
**Backend:** `http://localhost:8000` (FastAPI, health OK)  
**Verifier scripts:** `crust_hut/scripts/e2e-verify.mjs`, `crust_hut/scripts/e2e-browser.mjs`

---

## Passed tests

| # | Test | Result |
|---|---|---|
| 1 | Home page loads successfully | PASS |
| 1b | Home bestsellers/menu API has data | PASS (3 menu items) |
| 2 | Menu page loads; categories + items from backend | PASS (4 categories, 3 items) |
| 3 | Gallery loads correctly | PASS (6 images after seed) |
| 4 | User can sign up | PASS |
| 5 | User can log in | PASS |
| 6 | JWT authentication works (`GET /auth/me`) | PASS |
| 7 | Reservation can be submitted | PASS |
| 8 | Contact form submits successfully | PASS |
| 9 | User can place an order (Bearer JWT) | PASS |
| 10 | Order is stored in the database | PASS (`GET /orders/{id}`) |
| 11 | Logout works correctly (client clears token; unauthenticated `/me` → 401) | PASS |
| — | Contact page loads | PASS |
| — | CORS allows `http://localhost:3000` | PASS |
| — | Browser `/`, `/menu`, `/gallery`, `/contact`, `/about` — no JS/API errors | PASS |
| — | Sign In UI opens without pageerrors | PASS |

**Summary: 14/14 API journey checks PASS · 7/7 browser checks PASS**

---

## Failed tests

None on final verification run.

---

## Bugs fixed during verification

1. **Empty gallery (0 images)**  
   Backend returned an empty gallery collection, so the Gallery UI had nothing to show. Seeded 6 active Unsplash pizza/drink images via `POST /api/v1/gallery`. Gallery now returns `total=6`.

2. **Intermittent `/_next/image` HTTP 500 / TimeoutError**  
   Next.js image optimization was timing out when proxying Unsplash URLs (seen in the frontend terminal and briefly in gallery browser checks). Fixed by setting `images.unoptimized: true` in `next.config.ts` so images load directly from sources without the optimizer proxy. UI appearance unchanged.

---

## Remaining issues / notes

1. **Sparse menu seed data** — Backend currently has only **3** menu items and **4** categories (test/verify fixtures). UI works, but production catalog should be fully seeded.
2. **Featured bestsellers** — If no items have `is_featured=true`, the homepage Best Sellers section falls back to the first available items (by design in `getFeaturedMenuItems`).
3. **Gallery categories** — API has no `category` field; UI Pizzas/Drinks filters still use keyword inference from title/description (documented API mismatch).
4. **JWT logout** — No server-side token revoke endpoint (per API.md). Logout clears client storage only; tokens remain valid until expiry if stolen (expected for current API).
5. **Image CDN hosts** — If the backend later serves images from a non-Unsplash CDN, they will still load (unoptimized). Add hostnames to `remotePatterns` only if you re-enable optimization later.
6. **Browser automation** — Full UI click-through of signup/checkout was smoke-tested (Sign In opens). Full form submit flows were verified against the live API using the same payloads the frontend sends.

---

## Services status at verification time

| Service | Status |
|---|---|
| FastAPI `GET /health` | `{ "status": "ok" }` |
| Next.js | Running on port 3000 |
| Sample order created | e.g. `PZ-20260715162622-1AE4` persisted in DB |

---

## Conclusion

**Integration verification: COMPLETE.**  
All required end-to-end journey checks passed after fixing empty gallery data and Next.js image optimizer timeouts.
