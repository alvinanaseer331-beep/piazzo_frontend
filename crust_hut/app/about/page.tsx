import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutHero from "./AboutHero";
import OurStorySection from "./OurStorySection";

export const metadata: Metadata = {
  title: "About Us — PIAZZO",
  description:
    "Crafted by Fire. Shared with Passion. Learn the PIAZZO story — wood-fired pizza, handcrafted dough, and hospitality made for every table.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <AboutHero />
        <OurStorySection />
      </main>
      <Footer />
    </>
  );
}
