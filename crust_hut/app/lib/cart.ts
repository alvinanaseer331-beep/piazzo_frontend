export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "piazzo-cart";
export const CART_EVENT = "piazzo-cart-updated";

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
  }
}

export function getCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emit();
}

export function getCartCount(): number {
  return getCart().reduce((sum, line) => sum + line.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function addToCart(item: {
  id: string;
  name: string;
  price: number;
  image: string;
}) {
  const cart = getCart();
  const existing = cart.find((line) => line.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

export function updateQuantity(id: string, quantity: number) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((line) => line.id !== id);
  } else {
    cart = cart.map((line) =>
      line.id === id ? { ...line, quantity } : line,
    );
  }
  saveCart(cart);
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((line) => line.id !== id));
}

export function clearCart() {
  saveCart([]);
}
