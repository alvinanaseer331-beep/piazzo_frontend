/** Shared types matching API.md / FastAPI response models */

export type Paginated<T> = {
  items: T[];
  total: number;
  skip: number;
  limit: number;
};

export type UserRole = "customer" | "staff" | "admin";

export type ApiUser = {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer" | string;
  expires_in: number;
  user: ApiUser;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  category_id: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type Reservation = {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  status: ReservationStatus;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type OrderFulfillmentType = "pickup" | "delivery";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: number;
  order_number: string;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  subtotal: string | number;
  tax_amount: string | number;
  delivery_fee: string | number;
  total_amount: string | number;
  notes: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
};

export type CreateOrderPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfillment_type?: OrderFulfillmentType;
  notes?: string | null;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    special_instructions?: string | null;
  }>;
};

export type PaymentMethod = "cod" | "stripe" | "jazzcash" | "easypaisa";

export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded";

export type Payment = {
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string | null;
  amount: string | number;
  created_at: string;
};

export type CreatePaymentPayload = {
  order_id: number;
  payment_method: PaymentMethod;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function parseApiErrorMessage(body: unknown, fallback = "Request failed"): string {
  if (!body || typeof body !== "object") return fallback;
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string };
    if (typeof first?.msg === "string") return first.msg;
  }
  return fallback;
}
