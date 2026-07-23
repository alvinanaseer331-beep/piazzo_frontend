"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import PiazzoLogo from "./PiazzoLogo";
import LocationSelectionModal from "./LocationSelectionModal";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";
import UserProfileMenu from "./UserProfileMenu";
import { CART_EVENT, getCartCount } from "../lib/cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu", external: true },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/kitchen", label: "Kitchen" },
];

const LOCATION_KEY = "piazzo-location";

function readLocationCity(): string {
  try {
    const raw = sessionStorage.getItem(LOCATION_KEY);
    if (!raw) return "Islamabad";
    const parsed = JSON.parse(raw) as { label?: string };
    const label = parsed.label?.trim();
    if (!label) return "Islamabad";
    if (label.includes("·")) return label.split("·")[0].trim();
    const parts = label.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return parts[parts.length - 2];
    return label.length > 18 ? `${label.slice(0, 16)}…` : label;
  } catch {
    return "Islamabad";
  }
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function iconButtonClass(extra = "") {
  return `flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white ${extra}`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [city, setCity] = useState("Islamabad");

  useEffect(() => {
    setCity(readLocationCity());
  }, []);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());
    syncCart();
    window.addEventListener(CART_EVENT, syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener(CART_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLocationComplete = useCallback(
    (selection: { mode: string; label: string }) => {
      sessionStorage.setItem(LOCATION_KEY, JSON.stringify(selection));
      setCity(readLocationCity());
      setLocationOpen(false);
    },
    [],
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled || open
            ? "border-white/10 bg-charcoal/70 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            : "border-white/5 bg-charcoal/35 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto grid h-20 max-w-[1280px] grid-cols-[1fr_auto] items-center gap-4 px-5 md:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* Left — logo + wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-3 justify-self-start transition-opacity duration-200 hover:opacity-90"
          >
            <PiazzoLogo variant="mark" markSize={40} tone="brand" />
            <span className="font-[family-name:var(--font-outfit)] text-xl font-bold tracking-[-0.03em] text-white sm:text-[1.35rem]">
              PIAZZO
            </span>
          </Link>

          {/* Center — primary nav */}
          <ul className="hidden items-center justify-center gap-10 md:flex lg:gap-12">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    className="relative text-[15px] font-medium tracking-wide text-white/70 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-flame after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="relative text-[15px] font-medium tracking-wide text-white/70 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-flame after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right — utilities + CTA */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setLocationOpen(true);
              }}
              className="hidden max-w-[150px] items-center gap-2 rounded-full px-3 py-2 text-left transition-all duration-200 hover:bg-white/10 sm:inline-flex"
              aria-label={`Change location, currently ${city}`}
            >
              <LocationPinIcon className="h-4 w-4 shrink-0 text-flame" />
              <span className="truncate text-sm font-medium text-white/90">
                {city}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setLocationOpen(true);
              }}
              className={iconButtonClass("sm:hidden")}
              aria-label={`Change location, currently ${city}`}
            >
              <LocationPinIcon className="h-[18px] w-[18px] text-flame" />
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              className={iconButtonClass()}
              aria-label="Search pizzas or drinks"
            >
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setCartOpen(true);
              }}
              className={iconButtonClass("relative")}
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-flame px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <div className="mx-0.5 hidden h-5 w-px bg-white/15 lg:block" aria-hidden />

            <UserProfileMenu onOpenChange={() => setOpen(false)} />

            <a
              href="/menu"
              className="ml-1 hidden h-11 items-center justify-center rounded-[12px] bg-flame px-6 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ember hover:shadow-[0_8px_20px_rgba(226,43,32,0.28)] lg:inline-flex"
            >
              Order Now
            </a>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="flex w-5 flex-col gap-1.5">
                <span
                  className={`h-0.5 w-full bg-white transition-all duration-300 ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-white transition-all duration-300 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-white transition-all duration-300 ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile sheet */}
        <div
          className={`fixed inset-0 z-40 flex flex-col bg-charcoal/96 backdrop-blur-2xl transition-all duration-300 md:hidden ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pt-20">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white transition-colors duration-200 hover:text-flame"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white transition-colors duration-200 hover:text-flame"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
          <div className="px-6 pb-10">
            <a
              href="/menu"
              onClick={() => setOpen(false)}
              className="btn-primary w-full text-center"
            >
              Order Now
            </a>
          </div>
        </div>
      </header>

      <LocationSelectionModal
        open={locationOpen}
        onComplete={handleLocationComplete}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
