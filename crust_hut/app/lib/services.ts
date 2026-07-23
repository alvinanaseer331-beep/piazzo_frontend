import { apiFetch } from "./api";
import { FALLBACK_CATEGORIES, FALLBACK_MENU_ITEMS } from "../menu/data";
import type {
  Category,
  ContactMessage,
  CreateOrderPayload,
  CreatePaymentPayload,
  GalleryImage,
  MenuItem,
  Order,
  Paginated,
  Payment,
  Reservation,
} from "./types";

function qs(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export async function getCategories(params: {
  search?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
} = {}) {
  try {
    return await apiFetch<Paginated<Category>>(
      `/api/v1/categories${qs({ is_active: true, limit: 100, ...params })}`,
    );
  } catch (err) {
    console.warn("API offline or unreachable, using fallback categories", err);
    return {
      items: FALLBACK_CATEGORIES,
      total: FALLBACK_CATEGORIES.length,
      page: 1,
      size: 100,
      pages: 1,
    };
  }
}

export async function getMenuItems(params: {
  search?: string;
  category_id?: number;
  is_available?: boolean;
  skip?: number;
  limit?: number;
} = {}) {
  try {
    return await apiFetch<Paginated<MenuItem>>(
      `/api/v1/menu-items${qs({ is_available: true, limit: 100, ...params })}`,
    );
  } catch (err) {
    console.warn("API offline or unreachable, using fallback menu items", err);
    let items = FALLBACK_MENU_ITEMS;
    if (params.category_id != null) {
      items = items.filter((i) => i.category_id === params.category_id);
    }
    return {
      items,
      total: items.length,
      page: 1,
      size: 100,
      pages: 1,
    };
  }
}

export async function getFeaturedMenuItems(limit = 8) {
  const data = await getMenuItems({ is_available: true, limit: 100 });
  const featured = data.items.filter((i) => i.is_featured);
  return (featured.length ? featured : data.items).slice(0, limit);
}

export async function getGallery(params: {
  search?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
} = {}) {
  return apiFetch<Paginated<GalleryImage>>(
    `/api/v1/gallery${qs({ is_active: true, limit: 100, ...params })}`,
  );
}

export async function createReservation(payload: {
  name: string;
  email: string;
  phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_requests?: string | null;
  user_id?: number | null;
}) {
  return apiFetch<Reservation>("/api/v1/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createContactMessage(payload: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  return apiFetch<ContactMessage>("/api/v1/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createOrder(
  payload: CreateOrderPayload,
  token?: string | null,
) {
  return apiFetch<Order>("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    ...(token ? { token } : {}),
  });
}

export async function createPayment(payload: CreatePaymentPayload) {
  return apiFetch<Payment>("/api/v1/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listPayments(params: {
  order_id?: number;
  payment_method?: string;
  payment_status?: string;
  skip?: number;
  limit?: number;
} = {}) {
  return apiFetch<Paginated<Payment>>(
    `/api/v1/payments${qs({ limit: 100, ...params })}`,
  );
}

export async function listOrders(params: {
  search?: string;
  status?: string;
  user_id?: number;
  skip?: number;
  limit?: number;
} = {}) {
  return apiFetch<Paginated<Order>>(
    `/api/v1/orders${qs({ limit: 100, ...params })}`,
  );
}

export async function updateOrderStatus(orderId: number, status: string) {
  return apiFetch<Order>(`/api/v1/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function listKitchenOrders(params: {
  search?: string;
  status?: string;
  user_id?: number;
  skip?: number;
  limit?: number;
} = {}) {
  return apiFetch<Paginated<Order>>(
    `/api/v1/kitchen/orders${qs({ limit: 100, ...params })}`,
  );
}

export async function getKitchenOrder(orderId: number) {
  return apiFetch<Order>(`/api/v1/kitchen/orders/${orderId}`);
}

export async function updateKitchenOrderStatus(
  orderId: number,
  status: string,
) {
  return apiFetch<Order>(`/api/v1/kitchen/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/** Normalize HTML time (HH:MM) to API HH:MM:SS */
export function toApiTime(value: string): string {
  if (!value) return value;
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
}

export function parseMoney(value: string | number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}
