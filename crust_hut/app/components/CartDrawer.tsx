"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  CART_EVENT,
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  type CartLine,
} from "../lib/cart";
import { getAccessToken, getSessionUser } from "../lib/auth";
import { createOrder, createPayment, parseMoney } from "../lib/services";
import { ApiError, type PaymentMethod } from "../lib/types";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type OrderSuccessInfo = {
  orderNumber: string;
  customerName: string;
  totalAmount: string | number;
  paymentMethod: PaymentMethod;
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  stripe: "Card Payment (Stripe - Demo)",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [visible, setVisible] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<OrderSuccessInfo | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const successTitleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      setCheckoutOpen(false);
      setPaymentMethod(null);
      setError(null);
      setSuccessInfo(null);
      setSuccessVisible(false);
      setSubmitting(false);
      return;
    }
    setItems(getCart());
    const user = getSessionUser();
    if (user) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
      setCustomerPhone(user.phone ?? "");
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!successInfo) {
      setSuccessVisible(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setSuccessVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [successInfo]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (successInfo) {
        handleContinueShopping();
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, successInfo]);

  function handleContinueShopping() {
    setSuccessInfo(null);
    setSuccessVisible(false);
    setCheckoutOpen(false);
    setPaymentMethod(null);
    setNotes("");
    setError(null);
    onClose();
  }

  async function handleCheckout(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (paymentMethod === "stripe") {
      setError("Stripe integration coming soon");
      return;
    }

    setSubmitting(true);
    try {
      const cart = getCart();
      if (cart.length === 0) {
        setError("Your cart is empty");
        return;
      }

      const order = await createOrder(
        {
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_phone: customerPhone.trim(),
          fulfillment_type: fulfillment,
          notes: notes.trim() || null,
          items: cart.map((line) => ({
            menu_item_id: Number(line.id),
            quantity: line.quantity,
          })),
        },
        getAccessToken(),
      );

      await createPayment({
        order_id: order.id,
        payment_method: paymentMethod,
      });

      clearCart();
      setCheckoutOpen(false);
      setSuccessInfo({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        totalAmount: order.total_amount,
        paymentMethod,
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Checkout failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const total = getCartTotal();
  const showCartPanel = !successInfo;

  const successModal =
    successInfo && mounted
      ? createPortal(
          <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${
              successVisible ? "opacity-100" : "opacity-0"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={successTitleId}
          >
            <button
              type="button"
              className="absolute inset-0 bg-charcoal/70 backdrop-blur-md"
              aria-label="Close order confirmation"
              onClick={handleContinueShopping}
            />
            <div
              className={`relative z-10 w-full max-w-md rounded-[16px] border border-line bg-white p-6 shadow-[0_16px_40px_rgba(18,18,18,0.35)] transition-all duration-300 sm:p-8 ${
                successVisible
                  ? "translate-y-0 scale-100"
                  : "translate-y-4 scale-[0.98]"
              }`}
            >
              <div className="text-center">
                <p className="text-3xl" aria-hidden>
                  ✅
                </p>
                <h2
                  id={successTitleId}
                  className="mt-3 font-[family-name:var(--font-outfit)] text-2xl font-semibold text-charcoal"
                >
                  Order Placed Successfully
                </h2>
                <p className="mt-2 text-sm text-ash">
                  We&apos;ll start preparing your order shortly.
                </p>
              </div>

              <dl className="mt-6 space-y-3 rounded-[12px] border border-line bg-mist/60 px-4 py-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-ash">Order Number</dt>
                  <dd className="text-right font-semibold text-charcoal">
                    {successInfo.orderNumber}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-ash">Customer Name</dt>
                  <dd className="text-right font-semibold text-charcoal">
                    {successInfo.customerName}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-ash">Total Amount</dt>
                  <dd className="text-right font-semibold text-flame">
                    ${parseMoney(successInfo.totalAmount).toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-ash">Payment Method</dt>
                  <dd className="text-right font-semibold text-charcoal">
                    {PAYMENT_LABELS[successInfo.paymentMethod]}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="btn-primary w-full"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/orders"
                  onClick={handleContinueShopping}
                  className="btn-secondary w-full text-center"
                >
                  View My Orders
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {showCartPanel ? (
        <div
          className="fixed inset-0 z-[120]"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          <button
            type="button"
            className={`absolute inset-0 bg-charcoal/50 backdrop-blur-[2px] transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close cart"
            onClick={onClose}
          />

          <aside
            className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[0_16px_40px_rgba(18,18,18,0.2)] transition-transform duration-300 ease-out ${
              visible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-charcoal">
                  Your Cart
                </h2>
                <p className="mt-0.5 text-sm text-ash">
                  {items.reduce((n, l) => n + l.quantity, 0)} item
                  {items.reduce((n, l) => n + l.quantity, 0) === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line text-charcoal transition-colors hover:bg-mist"
                aria-label="Close cart"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
                  <p className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-charcoal">
                    Your cart is empty
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-ash">
                    Add pizzas or drinks from the menu to get started.
                  </p>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="btn-primary mt-6"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {items.map((line) => (
                      <li
                        key={line.id}
                        className="flex gap-3 border-b border-line pb-4 last:border-0"
                      >
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] bg-mist">
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            unoptimized={
                              !line.image.includes("images.unsplash.com")
                            }
                            className="object-cover"
                            sizes="64px"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-charcoal">
                              {line.name}
                            </p>
                            <p className="shrink-0 text-sm font-semibold text-flame">
                              ${(line.price * line.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-ash">
                            ${line.price.toFixed(2)} each
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-[8px] border border-line">
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center text-charcoal hover:bg-mist"
                                aria-label={`Decrease ${line.name}`}
                                onClick={() =>
                                  updateQuantity(line.id, line.quantity - 1)
                                }
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center text-charcoal hover:bg-mist"
                                aria-label={`Increase ${line.name}`}
                                onClick={() =>
                                  updateQuantity(line.id, line.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(line.id)}
                              className="text-xs font-medium text-ash underline-offset-2 hover:text-flame hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {checkoutOpen && (
                    <form
                      id="cart-checkout-form"
                      onSubmit={handleCheckout}
                      className="mt-6 space-y-3 border-t border-line pt-5"
                    >
                      <p className="font-[family-name:var(--font-outfit)] text-base font-semibold text-charcoal">
                        Checkout details
                      </p>
                      <input
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Full name"
                        className="h-11 w-full rounded-[8px] border border-line bg-mist px-3 text-sm outline-none focus:border-flame focus:bg-white"
                      />
                      <input
                        required
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email"
                        className="h-11 w-full rounded-[8px] border border-line bg-mist px-3 text-sm outline-none focus:border-flame focus:bg-white"
                      />
                      <input
                        required
                        type="tel"
                        minLength={7}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Phone"
                        className="h-11 w-full rounded-[8px] border border-line bg-mist px-3 text-sm outline-none focus:border-flame focus:bg-white"
                      />
                      <select
                        value={fulfillment}
                        onChange={(e) =>
                          setFulfillment(
                            e.target.value as "delivery" | "pickup",
                          )
                        }
                        className="h-11 w-full rounded-[8px] border border-line bg-mist px-3 text-sm outline-none focus:border-flame focus:bg-white"
                      >
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pickup</option>
                      </select>

                      <fieldset className="space-y-2">
                        <legend className="font-[family-name:var(--font-outfit)] text-base font-semibold text-charcoal">
                          Payment Method
                        </legend>
                        <label className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-line bg-mist px-3 py-2.5 text-sm text-charcoal has-[:checked]:border-flame has-[:checked]:bg-white">
                          <input
                            type="radio"
                            name="payment_method"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => {
                              setPaymentMethod("cod");
                              setError(null);
                            }}
                            className="accent-flame"
                          />
                          <span>Cash on Delivery</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-line bg-mist px-3 py-2.5 text-sm text-charcoal has-[:checked]:border-flame has-[:checked]:bg-white">
                          <input
                            type="radio"
                            name="payment_method"
                            value="stripe"
                            checked={paymentMethod === "stripe"}
                            onChange={() => {
                              setPaymentMethod("stripe");
                              setError(null);
                            }}
                            className="accent-flame"
                          />
                          <span>Card Payment (Stripe - Demo)</span>
                        </label>
                      </fieldset>

                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Order notes (optional)"
                        className="w-full resize-none rounded-[8px] border border-line bg-mist px-3 py-2 text-sm outline-none focus:border-flame focus:bg-white"
                      />
                    </form>
                  )}
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-ash">Subtotal</span>
                  <span className="font-[family-name:var(--font-outfit)] text-xl font-semibold text-charcoal">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <p
                    className="mb-3 rounded-[8px] border border-flame/25 bg-flame/5 px-3 py-2 text-sm text-flame"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {!checkoutOpen ? (
                  <button
                    type="button"
                    className="btn-primary w-full"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Checkout
                  </button>
                ) : (
                  <div
                    onClick={() => {
                      if (!paymentMethod) {
                        setError("Please select a payment method.");
                      }
                    }}
                  >
                    <button
                      type="submit"
                      form="cart-checkout-form"
                      className={`btn-primary w-full disabled:opacity-60 ${
                        !paymentMethod ? "pointer-events-none" : ""
                      }`}
                      disabled={submitting || !paymentMethod}
                    >
                      {submitting ? "Placing order…" : "Place Order"}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="mt-3 w-full text-center text-sm font-medium text-ash transition-colors hover:text-charcoal"
                >
                  Clear cart
                </button>
              </div>
            )}
          </aside>
        </div>
      ) : null}

      {successModal}
    </>
  );
}
