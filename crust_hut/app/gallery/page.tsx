import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GalleryHero from "./GalleryHero";
import GalleryPageGrid from "./GalleryPageGrid";

export const metadata: Metadata = {
  title: "Gallery — PIAZZO",
  description:
    "A house of fire and flavor. Explore moments from the PIAZZO kitchen, dining room, and wood-fired craft.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <GalleryHero />
        <GalleryPageGrid />
      </main>
      <Footer />
    </>
  );
}
