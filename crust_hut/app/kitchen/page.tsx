import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import KitchenDashboard from "./KitchenDashboard";

export const metadata: Metadata = {
  title: "Kitchen — PIAZZO",
  description: "Kitchen order dashboard for PIAZZO staff.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function KitchenPage() {
  return (
    <>
      <Navbar />
      <KitchenDashboard />
      <Footer />
    </>
  );
}
