import SplashGate from "./components/SplashGate";
import NotificationPrompt from "./components/NotificationPrompt";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BestSellers from "./components/BestSellers";
import ChefsSpecial from "./components/ChefsSpecial";
import WhyChooseUs from "./components/WhyChooseUs";
import AboutSection from "./components/AboutSection";
import Gallery from "./components/Gallery";
import TestimonialsSection from "./components/TestimonialsSection";
import ReservationCTA from "./components/ReservationCTA";
import DeliveryPartners from "./components/DeliveryPartners";
import FAQ from "./components/FAQ";
import VisitMap from "./components/VisitMap";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <SplashGate>
      <Navbar />
      <main>
        <Hero />
        <BestSellers />
        <ChefsSpecial />
        <WhyChooseUs />
        <AboutSection />
        <Gallery />
        <TestimonialsSection />
        <ReservationCTA />
        <DeliveryPartners />
        <FAQ />
        <VisitMap />
      </main>
      <Footer />
      <NotificationPrompt />
    </SplashGate>
  );
}
