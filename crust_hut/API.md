w# PIAZZO Backend API

Professional API reference for the PIAZZO pizza restaurant backend.  
Use this document when integrating a **Next.js** (or any) frontend.

| | |
|---|---|
| **Interactive docs** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) |
| **OpenAPI JSON** | [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) |
| **API version** | `0.1.0` |

---

## Table of contents

1. [Base URL](#1-base-url)
2. [Conventions](#2-conventions)
3. [Authentication & JWT](#3-authentication--jwt)
4. [Error responses](#4-error-responses)
5. [Health](#5-health)
6. [Auth](#6-auth)
7. [Categories](#7-categories)
8. [Menu items](#8-menu-items)
9. [Gallery](#9-gallery)
10. [Reservations](#10-reservations)
11. [Contact](#11-contact)
12. [Orders](#12-orders)
13. [Next.js integration notes](#13-nextjs-integration-notes)
14. [Enums & shared types](#14-enums--shared-types)

---

## 1. Base URL

| Environment | Base URL |
|---|---|
| Local development | `http://localhost:8000` |
| Versioned API prefix | `http://localhost:8000/api/v1` |

All business endpoints live under `/api/v1`, except health:

```text
GET http://localhost:8000/health
```

CORS is enabled for:

- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite)

Credentials and common headers/methods are allowed. Update `CORS_ORIGINS` in `.env` for production frontends.

---

## 2. Conventions

### Content type

- Requests with a body: `Content-Type: application/json`
- Responses: `application/json` (except `204 No Content`)

### Pagination lists

Most collection endpoints return:

```json
{
  "items": [],
  "total": 0,
  "skip": 0,
  "limit": 50
}
```

| Query | Type | Default | Notes |
|---|---|---|---|
| `skip` | integer | `0` | Offset (`>= 0`) |
| `limit` | integer | `50` | Page size (`1–100`) |

### Timestamps

`created_at` and `updated_at` are ISO-8601 datetime strings (UTC when possible).

### Money

Prices and totals are decimals as JSON numbers/strings (e.g. `12.50`). Prefer treating them as decimals on the frontend (not floats for arithmetic).

---

## 3. Authentication & JWT

### Flow

```text
1. POST /api/v1/auth/signup   →  creates account + returns access_token
   OR
   POST /api/v1/auth/login    →  returns access_token

2. Store access_token (httpOnly cookie recommended, or memory + refresh strategy)

3. Send on protected routes:
   Authorization: Bearer <access_token>

4. GET /api/v1/auth/me        →  current user profile
```

### JWT details

| Setting | Default |
|---|---|
| Algorithm | `HS256` |
| Lifetime | `60` minutes (`ACCESS_TOKEN_EXPIRE_MINUTES`) |
| Header | `Authorization: Bearer <token>` |
| Token type in response | `"bearer"` |
| Expiry field | `expires_in` (seconds) |

Signup and login responses include both the token **and** the user object so the UI can hydrate session state in one call.

### Protected endpoints

| Endpoint | Auth |
|---|---|
| `GET /api/v1/auth/me` | **Required** Bearer JWT |
| `POST /api/v1/orders` | Optional — if Bearer present, `user_id` is attached |
| All other listed endpoints | Public (no JWT required) |

In Swagger UI, click **Authorize**, choose HTTP Bearer, and paste the `access_token` (without the `Bearer` prefix).

---

## 4. Error responses

### Shape

```json
{
  "detail": "Human-readable error message"
}
```

Validation errors from Pydantic/FastAPI may return `detail` as an **array** of field errors:

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "email"],
      "msg": "email must be a valid email address",
      "input": "bad"
    }
  ]
}
```

### Common status codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `204` | Success, no body (deletes) |
| `401` | Missing/invalid JWT or bad credentials (`WWW-Authenticate: Bearer`) |
| `403` | Authenticated but not allowed (e.g. inactive user) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email, slug, name) |
| `422` | Validation / business-rule failure |

---

## 5. Health

### `GET /health`

Liveness probe (no auth).

**Response `200`**

```json
{
  "status": "ok"
}
```

---

## 6. Auth

Base path: `/api/v1/auth`

### `POST /api/v1/auth/signup`

Register a new customer account.

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `email` | string | yes | Valid email, unique, max 255 |
| `password` | string | yes | Min 8, max 128, no leading/trailing spaces |
| `full_name` | string | yes | Non-blank, max 150 |
| `phone` | string \| null | no | Max 30 |

**Example request**

```http
POST /api/v1/auth/signup HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "email": "guest@piazzo.com",
  "password": "SecurePass123",
  "full_name": "Jane Doe",
  "phone": "+1-555-0100"
}
```

**Response `201`**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "email": "guest@piazzo.com",
    "full_name": "Jane Doe",
    "phone": "+1-555-0100",
    "role": "customer",
    "is_active": true,
    "created_at": "2026-07-15T14:00:00Z",
    "updated_at": "2026-07-15T14:00:00Z"
  }
}
```

| Status | When |
|---|---|
| `201` | Account created |
| `409` | Email already registered |
| `422` | Invalid payload |

---

### `POST /api/v1/auth/login`

**Request body**

| Field | Type | Required |
|---|---|---|
| `email` | string | yes |
| `password` | string | yes |

**Example request**

```http
POST /api/v1/auth/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "email": "guest@piazzo.com",
  "password": "SecurePass123"
}
```

**Response `200`** — same shape as signup (`AuthResponse`).

| Status | When |
|---|---|
| `200` | Login OK |
| `401` | Incorrect email or password |
| `403` | Account inactive |
| `422` | Invalid payload |

---

### `GET /api/v1/auth/me`

Current authenticated user. **Requires Bearer JWT.**

**Example request**

```http
GET /api/v1/auth/me HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response `200`**

```json
{
  "id": 1,
  "email": "guest@piazzo.com",
  "full_name": "Jane Doe",
  "phone": "+1-555-0100",
  "role": "customer",
  "is_active": true,
  "created_at": "2026-07-15T14:00:00Z",
  "updated_at": "2026-07-15T14:00:00Z"
}
```

| Status | When |
|---|---|
| `200` | OK |
| `401` | Missing/invalid/expired token |
| `403` | Inactive user |

---

## 7. Categories

Base path: `/api/v1/categories`

### `GET /api/v1/categories`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `search` | string | no | Case-insensitive name search |
| `is_active` | boolean | no | Filter active flag |
| `skip` | integer | no | Default `0` |
| `limit` | integer | no | Default `50`, max `100` |

**Response `200`**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Pizza",
      "slug": "pizza",
      "description": "Wood-fired pizzas",
      "image_url": null,
      "is_active": true,
      "sort_order": 1,
      "created_at": "2026-07-15T14:00:00Z",
      "updated_at": "2026-07-15T14:00:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50
}
```

---

### `POST /api/v1/categories`

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | yes | Non-blank, unique, max 100 |
| `slug` | string \| null | no | Auto from name if omitted; unique; max 120 |
| `description` | string \| null | no | Max 2000 |
| `image_url` | string \| null | no | Max 500 |
| `is_active` | boolean | no | Default `true` |
| `sort_order` | integer | no | Default `0`, `>= 0` |

**Example request**

```json
{
  "name": "Pizza",
  "description": "Wood-fired pizzas",
  "is_active": true,
  "sort_order": 1
}
```

**Response `201`** — single category object (see item above).

| Status | When |
|---|---|
| `201` | Created |
| `409` | Duplicate name or slug |
| `422` | Validation error |

---

### `GET /api/v1/categories/{category_id}`

**Path**

| Name | Type |
|---|---|
| `category_id` | integer |

**Response `200`** — category object.  
**Response `404`** — not found.

---

### `PUT /api/v1/categories/{category_id}`

Partial update. Send only fields to change.

**Request body (all optional)**

`name`, `slug`, `description`, `image_url`, `is_active`, `sort_order`

**Response `200`** — updated category.  
**Response `404` / `409` / `422`**

---

### `DELETE /api/v1/categories/{category_id}`

**Response `204`** — no body.  
**Response `404`** — not found.

> Cascades to related menu items via DB relationship.

---

## 8. Menu items

Base path: `/api/v1/menu-items`

### `GET /api/v1/menu-items`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `search` | string | no | Case-insensitive name search |
| `category_id` | integer | no | Filter by category |
| `is_available` | boolean | no | Availability filter |
| `skip` | integer | no | Default `0` |
| `limit` | integer | no | Default `50`, max `100` |

**Response `200`**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "slug": "margherita-pizza",
      "description": "Tomato, mozzarella, basil",
      "price": "12.99",
      "category_id": 1,
      "image_url": null,
      "is_available": true,
      "is_featured": true,
      "sort_order": 0,
      "created_at": "2026-07-15T14:00:00Z",
      "updated_at": "2026-07-15T14:00:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50
}
```

---

### `POST /api/v1/menu-items`

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | yes | Non-blank, max 150 |
| `price` | decimal | yes | `> 0` |
| `category_id` | integer | yes | Must exist |
| `slug` | string \| null | no | Auto from name if omitted |
| `description` | string \| null | no | Max 2000 |
| `image_url` | string \| null | no | Max 500 |
| `is_available` | boolean | no | Default `true` |
| `is_featured` | boolean | no | Default `false` |
| `sort_order` | integer | no | Default `0` |

**Example request**

```json
{
  "name": "Margherita Pizza",
  "description": "Tomato, mozzarella, basil",
  "price": "12.99",
  "category_id": 1,
  "is_available": true,
  "is_featured": true
}
```

**Response `201`** — menu item object.

| Status | When |
|---|---|
| `201` | Created |
| `404` | Category not found |
| `409` | Slug conflict |
| `422` | Validation error |

---

### `GET /api/v1/menu-items/{item_id}`

**Path:** `item_id` (integer)  
**Response `200` / `404`**

---

### `PUT /api/v1/menu-items/{item_id}`

Partial update. Optional fields: `name`, `slug`, `description`, `price`, `category_id`, `image_url`, `is_available`, `is_featured`, `sort_order`.

**Response `200` / `404` / `409` / `422`**

---

### `DELETE /api/v1/menu-items/{item_id}`

**Response `204`**  
**Response `404`**  
**Response `409`** — referenced by existing order items

---

## 9. Gallery

Base path: `/api/v1/gallery`

### `GET /api/v1/gallery`

**Query parameters:** `search` (title), `is_active`, `skip`, `limit`

**Response `200`**

```json
{
  "items": [
    {
      "id": 1,
      "title": "Wood-fired oven",
      "description": "Our heart of the kitchen",
      "image_url": "https://cdn.example.com/gallery/oven.jpg",
      "is_active": true,
      "sort_order": 0,
      "created_at": "2026-07-15T14:00:00Z",
      "updated_at": "2026-07-15T14:00:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50
}
```

---

### `POST /api/v1/gallery`

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | string | yes | Non-blank, max 150 |
| `image_url` | string | yes | Non-blank, max 500 |
| `description` | string \| null | no | Max 2000 |
| `is_active` | boolean | no | Default `true` |
| `sort_order` | integer | no | Default `0` |

**Response `201`**

---

### `GET /api/v1/gallery/{image_id}`

**Path:** `image_id` (integer) → `200` / `404`

---

### `PUT /api/v1/gallery/{image_id}`

Partial update of gallery fields → `200` / `404` / `422`

---

### `DELETE /api/v1/gallery/{image_id}`

**Response `204` / `404`**

---

## 10. Reservations

Base path: `/api/v1/reservations`

### Validation rules (important)

| Field | Rules |
|---|---|
| `party_size` | Integer `1–20` |
| `reservation_date` | Not in the past |
| `reservation_time` | Between **11:00** and **22:00** (inclusive) |
| Combined date+time | Must not be in the past (UTC) |
| `email` | Basic email format |
| `status` | See [enums](#14-enums--shared-types) |

---

### `GET /api/v1/reservations`

**Query parameters**

| Name | Type | Description |
|---|---|---|
| `search` | string | Name or email |
| `status` | enum | `pending`, `confirmed`, `cancelled`, `completed`, `no_show` |
| `reservation_date` | date | `YYYY-MM-DD` |
| `skip` / `limit` | integer | Pagination |

**Response `200`** — `{ items, total, skip, limit }`

---

### `POST /api/v1/reservations`

**Request body**

| Field | Type | Required |
|---|---|---|
| `name` | string | yes |
| `email` | string | yes |
| `phone` | string | yes (min 7) |
| `party_size` | integer | yes |
| `reservation_date` | date | yes (`YYYY-MM-DD`) |
| `reservation_time` | time | yes (`HH:MM:SS`) |
| `special_requests` | string \| null | no |
| `user_id` | integer \| null | no |
| `status` | enum | no (default `pending`) |

**Example request**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0100",
  "party_size": 4,
  "reservation_date": "2026-07-20",
  "reservation_time": "19:00:00",
  "special_requests": "Window seat"
}
```

**Response `201`**

```json
{
  "id": 1,
  "user_id": null,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0100",
  "party_size": 4,
  "reservation_date": "2026-07-20",
  "reservation_time": "19:00:00",
  "status": "pending",
  "special_requests": "Window seat",
  "created_at": "2026-07-15T14:00:00Z",
  "updated_at": "2026-07-15T14:00:00Z"
}
```

| Status | When |
|---|---|
| `201` | Created |
| `404` | `user_id` provided but user missing |
| `422` | Validation / past datetime / bad time window |

---

### `GET /api/v1/reservations/{reservation_id}`

**Path:** `reservation_id` → `200` / `404`

---

### `PUT /api/v1/reservations/{reservation_id}`

Partial update. Optional: `name`, `email`, `phone`, `party_size`, `reservation_date`, `reservation_time`, `status`, `special_requests`, `user_id`.

**Response `200` / `404` / `422`**

---

### `DELETE /api/v1/reservations/{reservation_id}`

**Response `204` / `404`**

---

## 11. Contact

Base path: `/api/v1/contact`

### Validation rules

| Field | Rules |
|---|---|
| `name` | Required, non-blank, max 150 |
| `email` | Required, valid email |
| `subject` | Required, non-blank, max 200 |
| `message` | Required, min **5** chars, max 5000 |
| `phone` | Optional, max 30 |

---

### `GET /api/v1/contact`

**Query:** `search` (name/email/subject), `is_read`, `skip`, `limit`  
**Response `200`** — paginated list

---

### `POST /api/v1/contact`

**Example request**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0100",
  "subject": "Catering inquiry",
  "message": "I would like to book a private event for 30 guests."
}
```

**Response `201`**

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0100",
  "subject": "Catering inquiry",
  "message": "I would like to book a private event for 30 guests.",
  "is_read": false,
  "created_at": "2026-07-15T14:00:00Z",
  "updated_at": "2026-07-15T14:00:00Z"
}
```

---

### `GET /api/v1/contact/{message_id}`

**Response `200` / `404`**

---

### `PUT /api/v1/contact/{message_id}`

Partial update (often used to set `"is_read": true`).  
**Response `200` / `404` / `422`**

---

### `DELETE /api/v1/contact/{message_id}`

**Response `204` / `404`**

---

## 12. Orders

Base path: `/api/v1/orders`

### Pricing (server-side)

Defaults (configurable via env):

| Setting | Default |
|---|---|
| `TAX_RATE` | `0.08` (8%) |
| `DELIVERY_FEE` | `4.99` |

```text
subtotal      = Σ (unit_price × quantity)   // prices snapshotted from menu
tax_amount    = round(subtotal × TAX_RATE, 2)
delivery_fee  = DELIVERY_FEE if fulfillment_type == "delivery" else 0
total_amount  = subtotal + tax_amount + delivery_fee
```

Each line item stores **unit_price** and **subtotal** snapshots at order time.

### Auth behavior on create

- No `Authorization` header → guest order (`user_id: null`)
- Valid Bearer JWT → order linked to that user (`user_id` set)

---

### `GET /api/v1/orders`

**Query parameters**

| Name | Type | Description |
|---|---|---|
| `search` | string | Customer name, email, or order number |
| `status` | enum | Order status filter |
| `user_id` | integer | Filter by owner |
| `skip` / `limit` | integer | Pagination |

---

### `POST /api/v1/orders`

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `customer_name` | string | yes | Non-blank |
| `customer_email` | string | yes | Valid email |
| `customer_phone` | string | yes | Min 7 |
| `fulfillment_type` | enum | no | `pickup` \| `delivery` (default `delivery`) |
| `notes` | string \| null | no | Max 2000 |
| `items` | array | yes | Min 1 item; unique `menu_item_id`s |

**Item object**

| Field | Type | Required | Rules |
|---|---|---|---|
| `menu_item_id` | integer | yes | Must exist & be available |
| `quantity` | integer | yes | `1–50` |
| `special_instructions` | string \| null | no | Max 500 |

**Example request**

```http
POST /api/v1/orders HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "+1-555-0100",
  "fulfillment_type": "delivery",
  "notes": "Ring the bell",
  "items": [
    { "menu_item_id": 1, "quantity": 2 },
    { "menu_item_id": 2, "quantity": 1, "special_instructions": "Extra spicy" }
  ]
}
```

**Response `201`**

```json
{
  "id": 1,
  "order_number": "PZ-20260715143012-2FF6",
  "user_id": 1,
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "+1-555-0100",
  "status": "pending",
  "subtotal": "33.98",
  "tax_amount": "2.72",
  "delivery_fee": "4.99",
  "total_amount": "41.69",
  "notes": "Ring the bell",
  "items": [
    {
      "id": 1,
      "menu_item_id": 1,
      "quantity": 2,
      "unit_price": "12.99",
      "subtotal": "25.98",
      "special_instructions": null,
      "created_at": "2026-07-15T14:30:12Z",
      "updated_at": "2026-07-15T14:30:12Z"
    },
    {
      "id": 2,
      "menu_item_id": 2,
      "quantity": 1,
      "unit_price": "8.00",
      "subtotal": "8.00",
      "special_instructions": "Extra spicy",
      "created_at": "2026-07-15T14:30:12Z",
      "updated_at": "2026-07-15T14:30:12Z"
    }
  ],
  "created_at": "2026-07-15T14:30:12Z",
  "updated_at": "2026-07-15T14:30:12Z"
}
```

| Status | When |
|---|---|
| `201` | Created |
| `401` | Invalid Bearer token (if header sent) |
| `404` | Menu item missing |
| `422` | Empty items, duplicates, unavailable items, bad payload |

---

### `GET /api/v1/orders/{order_id}`

**Path:** `order_id` → `200` / `404`

---

### `PUT /api/v1/orders/{order_id}`

Updates **customer details / notes only** (not line items or status).

**Request body (all optional):** `customer_name`, `customer_email`, `customer_phone`, `notes`

Blocked when status is `delivered` or `cancelled` → **422**.

---

### `PATCH /api/v1/orders/{order_id}/status`

**Request body**

```json
{ "status": "confirmed" }
```

**Allowed transitions**

| From | To |
|---|---|
| `pending` | `confirmed`, `cancelled` |
| `confirmed` | `preparing`, `cancelled` |
| `preparing` | `ready`, `cancelled` |
| `ready` | `delivered`, `cancelled` |
| `delivered` / `cancelled` | _(terminal)_ |

| Status | When |
|---|---|
| `200` | Updated |
| `404` | Order not found |
| `422` | Illegal transition |

---

### `DELETE /api/v1/orders/{order_id}`

Only **`pending`** or **`cancelled`** orders may be deleted.

**Response `204` / `404` / `422`**

---

## 13. Next.js integration notes

### Environment

```env
# .env.local (Next.js)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Fetch helper (App Router)

```ts
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw Object.assign(new Error(typeof err.detail === "string" ? err.detail : "Request failed"), {
      status: res.status,
      body: err,
    });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
```

### Suggested session storage

1. After `signup` / `login`, persist `access_token` and `user`.
2. Prefer an **httpOnly cookie** set by a Next.js Route Handler (BFF) over `localStorage` for XSS safety.
3. If using client storage, clear token on `401` from `/auth/me`.
4. Track `expires_in` and force re-login when expired (no refresh token yet).

### Typical frontend route mapping

| Frontend page | Backend calls |
|---|---|
| Menu / shop | `GET /categories`, `GET /menu-items` |
| Cart checkout | `POST /orders` (+ optional Bearer) |
| Account | `POST /auth/signup`, `POST /auth/login`, `GET /auth/me` |
| Reserve a table | `POST /reservations` |
| Contact form | `POST /contact` |
| Gallery page | `GET /gallery?is_active=true` |
| Admin panels | Full CRUD + `PATCH /orders/{id}/status` |

### CORS / cookies

- Browser calls from `localhost:3000` to `localhost:8000` are allowed.
- If you switch to cookie auth later, set `credentials: "include"` on fetch and configure cookie `SameSite` carefully.

### Money & forms

- Send prices only indirectly (server prices menu items; never trust client prices for orders).
- Send reservation times as `HH:MM:SS` (e.g. `19:00:00`).
- Handle FastAPI `422` arrays in UI form error mapping via `detail[].loc`.

### Server Actions / Route Handlers

Calling the API from Next.js **server** code (Server Components / Route Handlers) avoids CORS entirely and is preferred for privileged admin mutations.

---

## 14. Enums & shared types

### `UserRole`

`customer` | `staff` | `admin`  
(New signups are always `customer`.)

### `ReservationStatus`

`pending` | `confirmed` | `cancelled` | `completed` | `no_show`

### `OrderStatus`

`pending` | `confirmed` | `preparing` | `ready` | `delivered` | `cancelled`

### `OrderFulfillmentType`

`pickup` | `delivery`

---

## Quick start (backend)

```bash
cd backend_crusthub   # or workspace root with uv project
uv run python run.py
# or: uv run uvicorn main:app --reload --reload-dir backend_crusthub/app
```

Then open [http://localhost:8000/docs](http://localhost:8000/docs).

---

*Generated for the PIAZZO FastAPI backend. For live schema details and “Try it out”, prefer Swagger UI, which always reflects the running server.*
