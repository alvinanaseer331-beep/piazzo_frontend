import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactHero from "./ContactHero";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us — PIAZZO",
  description:
    "Reserve a table or get in touch with PIAZZO. Address, hours, map, and reservations for our wood-fired pizza house.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <ContactHero />
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
