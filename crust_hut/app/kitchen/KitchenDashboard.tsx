"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  parseApiErrorMessage,
  type Order,
  type OrderStatus,
} from "../lib/types";
import {
  getMenuItems,
  getKitchenOrder,
  listKitchenOrders,
  parseMoney,
  updateKitchenOrderStatus,
} from "../lib/services";

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

/** Forward kitchen transitions only (cancel stays out of the happy path). */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Confirm",
  confirmed: "Start preparing",
  preparing: "Mark ready",
  ready: "Mark delivered",
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
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [nameByMenuId, setNameByMenuId] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, menuRes] = await Promise.all([
        listKitchenOrders({ limit: 100, skip: 0 }),
        getMenuItems({ limit: 100 }),
      ]);
      setOrders(ordersRes.items);
      setTotal(ordersRes.total);
      const map: Record<number, string> = {};
      for (const item of menuRes.items) {
        map[item.id] = item.name;
      }
      setNameByMenuId(map);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : err instanceof Error
            ? err.message
            : "Failed to load orders.";
      setError(message);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [orders],
  );

  async function advanceStatus(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setActionError(null);
    setUpdatingId(order.id);
    try {
      await updateKitchenOrderStatus(order.id, next);
      const updated = await getKitchenOrder(order.id);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o)),
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? parseApiErrorMessage(err.body, err.message)
          : err instanceof Error
            ? err.message
            : "Failed to update status.";
      setActionError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-stone pt-20 text-charcoal">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
              Kitchen
            </h1>
            <p className="mt-1 text-sm text-ash">
              Live orders from the counter — refresh to see the latest.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-full bg-flame px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember disabled:opacity-60"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error ? (
          <div
            className="rounded-2xl border border-flame/30 bg-white px-5 py-4 text-sm text-ember"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {actionError ? (
          <div
            className="mb-4 rounded-2xl border border-flame/30 bg-white px-5 py-4 text-sm text-ember"
            role="alert"
          >
            {actionError}
          </div>
        ) : null}

        {!error && !loading && sorted.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-charcoal">
              No orders yet
            </p>
            <p className="mt-2 text-sm text-ash">
              New customer orders will show up here.
            </p>
          </div>
        ) : null}

        {loading && sorted.length === 0 && !error ? (
          <p className="text-sm text-ash">Loading orders…</p>
        ) : null}

        {sorted.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-ash">
              Showing {sorted.length}
              {total > sorted.length ? ` of ${total}` : ""} order
              {sorted.length === 1 ? "" : "s"}
            </p>
            <ul className="space-y-4">
              {sorted.map((order) => {
                const next = NEXT_STATUS[order.status];
                const nextLabel = NEXT_LABEL[order.status];
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
                          Order ID #{order.id} · {formatWhen(order.created_at)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_CLASS[order.status]}`}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
                      <p>
                        <span className="text-ash">Customer: </span>
                        <span className="font-medium text-charcoal">
                          {order.customer_name}
                        </span>
                      </p>
                      <p>
                        <span className="text-ash">Phone: </span>
                        <span className="font-medium text-charcoal">
                          {order.customer_phone}
                        </span>
                      </p>
                      <p className="sm:col-span-2">
                        <span className="text-ash">Email: </span>
                        <span className="font-medium text-charcoal">
                          {order.customer_email}
                        </span>
                      </p>
                    </div>

                    {order.notes ? (
                      <p className="mt-3 rounded-xl bg-mist/80 px-3 py-2 text-sm text-ink">
                        <span className="font-medium text-ash">Notes: </span>
                        {order.notes}
                      </p>
                    ) : null}

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
                              {item.special_instructions ? (
                                <span className="mt-0.5 block text-xs text-ash">
                                  {item.special_instructions}
                                </span>
                              ) : null}
                            </span>
                            <span className="tabular-nums text-ash">
                              {money(item.subtotal)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-right text-sm font-semibold text-charcoal">
                        Total {money(order.total_amount)}
                      </p>
                    </div>

                    {next && nextLabel ? (
                      <div className="mt-4 border-t border-line pt-4">
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => void advanceStatus(order)}
                          className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
                        >
                          {updatingId === order.id
                            ? "Updating…"
                            : nextLabel}
                        </button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
