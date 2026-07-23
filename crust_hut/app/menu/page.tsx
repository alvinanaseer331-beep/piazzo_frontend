import type { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Our Menu — PIAZZO",
  description:
    "Explore classic and signature wood-fired pizzas, soft drinks, and fresh juices at PIAZZO. Crafted with premium ingredients. Baked fresh. Served with passion.",
};

export default function MenuPage() {
  return <MenuClient />;
}
