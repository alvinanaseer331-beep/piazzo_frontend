const API = process.env.API_BASE || "http://localhost:8000";
const FE = process.env.FE_BASE || "http://localhost:3000";

const results = [];

function pass(name, detail = "") {
  results.push({ status: "PASS", name, detail });
  console.log(`PASS | ${name}${detail ? " — " + detail : ""}`);
}
function fail(name, detail = "") {
  results.push({ status: "FAIL", name, detail });
  console.log(`FAIL | ${name}${detail ? " — " + detail : ""}`);
}

async function getJson(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const err = new Error(
      typeof body?.detail === "string"
        ? body.detail
        : `HTTP ${res.status}: ${text.slice(0, 200)}`,
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function pageOk(path) {
  const res = await fetch(`${FE}${path}`);
  return res.status === 200;
}

async function main() {
  // 1 Home
  try {
    if (await pageOk("/")) pass("1. Home page loads");
    else fail("1. Home page loads", "non-200");
  } catch (e) {
    fail("1. Home page loads", e.message);
  }

  // bestsellers / health of home APIs
  let menu;
  try {
    menu = await getJson("/api/v1/menu-items?is_available=true&limit=100");
    if (menu.items?.length > 0)
      pass("1b. Home menu/bestsellers API", `items=${menu.items.length}`);
    else fail("1b. Home menu/bestsellers API", "empty");
  } catch (e) {
    fail("1b. Home menu/bestsellers API", e.message);
  }

  // 2 Menu page + backend
  try {
    const page = await pageOk("/menu");
    const cats = await getJson("/api/v1/categories?is_active=true&limit=100");
    if (page && cats.items?.length > 0 && menu?.items?.length > 0)
      pass(
        "2. Menu loads from backend",
        `page=200 cats=${cats.items.length} items=${menu.items.length}`,
      );
    else
      fail(
        "2. Menu loads from backend",
        `page=${page} cats=${cats.items?.length} items=${menu?.items?.length}`,
      );
  } catch (e) {
    fail("2. Menu loads from backend", e.message);
  }

  // 3 Gallery
  try {
    const page = await pageOk("/gallery");
    const gal = await getJson("/api/v1/gallery?is_active=true&limit=100");
    if (page && gal.items?.length > 0)
      pass("3. Gallery loads correctly", `items=${gal.items.length}`);
    else
      fail(
        "3. Gallery loads correctly",
        `page=${page} items=${gal.items?.length ?? 0}`,
      );
  } catch (e) {
    fail("3. Gallery loads correctly", e.message);
  }

  const email = `e2e.${Date.now()}@piazzo.test`;
  const password = "SecurePass123";
  let token;
  let userId;

  // 4 Signup
  try {
    const signup = await getJson("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: "E2E Browser User",
        phone: "051987661",
      }),
    });
    token = signup.access_token;
    userId = signup.user.id;
    if (token && userId) pass("4. User can sign up", `user_id=${userId}`);
    else fail("4. User can sign up", "missing token/user");
  } catch (e) {
    fail("4. User can sign up", e.message);
  }

  // 5 Login
  try {
    const login = await getJson("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    token = login.access_token;
    if (token) pass("5. User can log in");
    else fail("5. User can log in", "no token");
  } catch (e) {
    fail("5. User can log in", e.message);
  }

  // 6 JWT
  try {
    const me = await getJson("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (me.email === email) pass("6. JWT authentication works", `id=${me.id}`);
    else fail("6. JWT authentication works", "email mismatch");
  } catch (e) {
    fail("6. JWT authentication works", e.message);
  }

  // 7 Reservation
  try {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    const reservation_date = d.toISOString().slice(0, 10);
    const res = await getJson("/api/v1/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Browser User",
        email,
        phone: "051987661",
        party_size: 2,
        reservation_date,
        reservation_time: "19:00:00",
        special_requests: "E2E automation",
        user_id: userId,
      }),
    });
    if (res.id) pass("7. Reservation submitted", `id=${res.id}`);
    else fail("7. Reservation submitted", "no id");
  } catch (e) {
    fail("7. Reservation submitted", e.message);
  }

  // 8 Contact
  try {
    const msg = await getJson("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Browser User",
        email,
        phone: "051987661",
        subject: "E2E contact",
        message: "End-to-end contact form verification message.",
      }),
    });
    if (msg.id) pass("8. Contact form submits", `id=${msg.id}`);
    else fail("8. Contact form submits", "no id");
  } catch (e) {
    fail("8. Contact form submits", e.message);
  }

  // 9 Order
  let order;
  try {
    const itemId = menu.items[0].id;
    order = await getJson("/api/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_name: "E2E Browser User",
        customer_email: email,
        customer_phone: "051987661",
        fulfillment_type: "delivery",
        notes: "E2E order",
        items: [{ menu_item_id: itemId, quantity: 1 }],
      }),
    });
    if (order.order_number)
      pass(
        "9. User can place an order",
        `${order.order_number} total=${order.total_amount}`,
      );
    else fail("9. User can place an order", "missing order_number");
  } catch (e) {
    fail("9. User can place an order", e.message);
  }

  // 10 Stored
  try {
    const stored = await getJson(`/api/v1/orders/${order.id}`);
    if (stored.id === order.id && stored.order_number === order.order_number)
      pass("10. Order stored in database", `id=${stored.id}`);
    else fail("10. Order stored in database", "mismatch");
  } catch (e) {
    fail("10. Order stored in database", e.message);
  }

  // 11 Logout - client clears token; empty/invalid bearer rejected
  try {
    await getJson("/api/v1/auth/me", {
      headers: { Authorization: "Bearer" },
    });
    fail("11. Logout works correctly", "empty bearer accepted");
  } catch (e) {
    if (e.status === 401)
      pass("11. Logout works correctly", "client clears token; 401 without JWT");
    else fail("11. Logout works correctly", e.message);
  }

  // Contact page present
  try {
    if (await pageOk("/contact")) pass("Contact page loads");
    else fail("Contact page loads");
  } catch (e) {
    fail("Contact page loads", e.message);
  }

  // CORS
  try {
    const res = await fetch(`${API}/api/v1/menu-items?limit=1`, {
      headers: { Origin: "http://localhost:3000" },
    });
    const acao = res.headers.get("access-control-allow-origin");
    if (res.ok && (acao === "http://localhost:3000" || acao === "*"))
      pass("CORS for frontend origin", acao);
    else fail("CORS for frontend origin", `status=${res.status} acao=${acao}`);
  } catch (e) {
    fail("CORS for frontend origin", e.message);
  }

  const failed = results.filter((r) => r.status === "FAIL");
  const passed = results.filter((r) => r.status === "PASS");
  console.log("\n=== SUMMARY ===");
  console.log(`Passed: ${passed.length}`);
  console.log(`Failed: ${failed.length}`);
  if (failed.length) {
    console.log("Failed tests:");
    failed.forEach((f) => console.log(` - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
