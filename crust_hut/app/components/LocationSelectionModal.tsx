"use client";

import { useEffect, useId, useState } from "react";
import PiazzoLogo from "./PiazzoLogo";

type FulfillmentMode = "delivery" | "pickup";

type LocationSelectionModalProps = {
  open: boolean;
  onComplete: (selection: {
    mode: FulfillmentMode;
    label: string;
  }) => void;
};

const PICKUP_STORES = [
  { id: "i8", label: "Islamabad · I-8 Markaz" },
  { id: "f7", label: "Islamabad · F-7 Markaz" },
];

export default function LocationSelectionModal({
  open,
  onComplete,
}: LocationSelectionModalProps) {
  const titleId = useId();
  const [mode, setMode] = useState<FulfillmentMode>("delivery");
  const [address, setAddress] = useState("");
  const [storeId, setStoreId] = useState(PICKUP_STORES[0].id);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function handleContinue() {
    if (mode === "delivery") {
      const trimmed = address.trim();
      if (trimmed.length < 5) {
        setError("Enter a delivery address to continue.");
        return;
      }
      onComplete({ mode, label: trimmed });
      return;
    }
    const store = PICKUP_STORES.find((s) => s.id === storeId)!;
    onComplete({ mode, label: store.label });
  }

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-6 ${
        visible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-[#121212]/75 backdrop-blur-md" />

      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-t-[16px] border border-white/10 bg-[#1a1a1a] shadow-[0_16px_40px_rgba(18,18,18,0.35)] transition-all duration-500 ease-out sm:rounded-[16px] ${
          visible ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.98] sm:translate-y-4"
        }`}
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#E22B20]/15 blur-3xl" />

        <div className="relative px-6 pb-7 pt-8 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <PiazzoLogo variant="mark" markSize={44} tone="brand" />
            <h2
              id={titleId}
              className="mt-4 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight text-white"
            >
              Where should we send the fire?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Choose delivery or pickup to start your PIAZZO order.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-[12px] bg-white/5 p-1">
            {(
              [
                { id: "delivery", label: "Delivery" },
                { id: "pickup", label: "Pickup" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setMode(option.id);
                  setError("");
                }}
                className={`min-h-11 rounded-[10px] text-sm font-semibold transition-all duration-200 ${
                  mode === option.id
                    ? "bg-[#E22B20] text-white shadow-[0_8px_20px_rgba(226,43,32,0.25)]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {mode === "delivery" ? (
              <div>
                <label
                  htmlFor="piazzo-delivery-address"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Delivery address
                </label>
                <input
                  id="piazzo-delivery-address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError("");
                  }}
                  placeholder="Street, city, ZIP"
                  className="h-12 w-full rounded-[8px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#E22B20]"
                />
              </div>
            ) : (
              <div>
                <p className="mb-2 text-sm font-medium text-white/80">
                  Select a store
                </p>
                <div className="space-y-2">
                  {PICKUP_STORES.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => setStoreId(store.id)}
                      className={`flex min-h-12 w-full items-center rounded-[8px] border px-4 text-left text-sm transition-all ${
                        storeId === store.id
                          ? "border-[#E22B20] bg-[#E22B20]/10 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/25"
                      }`}
                    >
                      {store.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {error ? (
              <p className="mt-2 text-sm text-[#E22B20]" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary mt-6 w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
