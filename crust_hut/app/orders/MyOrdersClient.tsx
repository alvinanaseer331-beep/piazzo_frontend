"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AUTH_EVENT,
  getSessionUser,
  type SessionUser,
} from "../lib/auth";
import {
  getMenuItems,
  listOrders,
  listPayments,
  parseMoney,
} from "../lib/services";
import {
  ApiError,
  parseApiErrorMessage,
  type Order,
  type OrderStatus,
  type PaymentMethod,
} from "../lib/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  preparing: "bg-orange-100 text-orange-900",
  ready: "bg-basil/15 text-basil",
  delivered: "bg-mist text-ash",
  cancelled: "bg-flame/10 text-ember",
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  stripe: "Card Payment (Stripe - Demo)",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

function money(value: string | number) {
  return `$${parseMoney(value).toFixed(2)}`;
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MyOrdersClient() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentByOrderId, setPaymentByOrderId] = useState<
    Record<number, PaymentMethod>
  >({});
  const [nameByMenuId, setNameByMenuId] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const load = useCallback(async (session: SessionUser | null) => {
    if (!session) {
      setOrders([]);
      setPaymentByOrderId({});
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [ordersRes, menuRes] = await Promise.all([
        listOrders({ user_id: session.id, limit: 100, skip: 0 }),
        getMenuItems({ limit: 100 }),
      ]);

      const map: Record<number, string> = {};
      for (const item of menuRes.items) {
        map[item.id] = item.name;
      }

      const payments = await Promise.all(
        ordersRes.items.map(async (order) => {
          const res = await listPayments({ order_id: order.id, limit: 10 });
          const payment = res.items[0];
          return [order.id, payment?.payment_method] as const;
        }),
      );

      const paymentMap: Record<number, PaymentMethod> = {};
      for (const [orderId, method] of payments) {
        if (method) paymentMap[orderId] = method;
      }

      // Set all data together so the first paint includes payment methods
      setNameByMenuId(map);
      setPaymentByOrderId(paymentMap);
      setOrders(ordersRes.items);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : err instanceof Error
            ? err.message
            : "Failed to load your orders.";
      setError(message);
      setOrders([]);
      setPaymentByOrderId({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(user);
  }, [user, load]);

  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [orders],
  );

  return (
    <div className="min-h-screen pt-20 text-charcoal">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-ash"
            >
              <Link href="/" className="transition-colors hover:text-charcoal">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-charcoal">My Orders</span>
            </nav>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-ash">
              Track your PIAZZO orders, payments, and status.
            </p>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => void load(user)}
              disabled={loading}
              className="rounded-full bg-flame px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!user ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-charcoal">
              Sign in to view your orders
            </p>
            <p className="mt-2 text-sm text-ash">
              Your order history is available after you create an account or
              sign in.
            </p>
            <Link href="/menu" className="btn-primary mt-6 inline-flex">
              Browse Menu
            </Link>
          </div>
        ) : null}

        {user && error ? (
          <div
            className="rounded-2xl border border-flame/30 bg-white px-5 py-4 text-sm text-ember"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {user && loading && sorted.length === 0 && !error ? (
          <p className="text-sm text-ash">Loading your orders…</p>
        ) : null}

        {user && !loading && !error && sorted.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-charcoal">
              You haven&apos;t placed any orders yet.
            </p>
            <p className="mt-2 text-sm text-ash">
              When you place an order while signed in, it will appear here.
            </p>
            <Link href="/menu" className="btn-primary mt-6 inline-flex">
              Start Ordering
            </Link>
          </div>
        ) : null}

        {user && sorted.length > 0 ? (
          <ul className="space-y-4">
            {sorted.map((order) => {
              const paymentMethod = paymentByOrderId[order.id];
              return (
                <li
                  key={order.id}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-semibold tracking-tight text-charcoal">
                        {order.order_number}
                      </p>
                      <p className="mt-1 text-sm text-ash">
                        {formatWhen(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_CLASS[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-line pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ash">
                      Items
                    </p>
                    <ul className="mt-2 space-y-2">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                        >
                          <span className="text-charcoal">
                            <span className="font-semibold">
                              {item.quantity}×
                            </span>{" "}
                            {nameByMenuId[item.menu_item_id] ??
                              `Item #${item.menu_item_id}`}
                          </span>
                          <span className="tabular-nums text-ash">
                            {money(item.subtotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 grid gap-2 border-t border-line pt-4 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-ash">Payment Method: </span>
                      <span className="font-medium text-charcoal">
                        {paymentMethod
                          ? PAYMENT_LABEL[paymentMethod]
                          : "Not recorded"}
                      </span>
                    </p>
                    <p className="sm:text-right">
                      <span className="text-ash">Total Amount: </span>
                      <span className="font-semibold text-charcoal">
                        {money(order.total_amount)}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
