import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyOrdersClient from "./MyOrdersClient";

export const metadata: Metadata = {
  title: "My Orders — PIAZZO",
  description: "View your PIAZZO order history, payment methods, and status.",
};

export default function MyOrdersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone">
        <MyOrdersClient />
      </main>
      <Footer />
    </>
  );
}
