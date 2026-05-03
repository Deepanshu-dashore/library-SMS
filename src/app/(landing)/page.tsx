import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import RegistrationSection from "./components/RegistrationSection";
import FacilitiesSection from "./components/FacilitiesSection";
import PricingSection from "./components/PricingSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import RegistrationCTA from "./components/RegistrationCTA";
import VisitUsSection from "./components/VisitUsSection";
import FooterSection from "./components/FooterSection";
import "./landing.css";

export const metadata: Metadata = {
  title: "Premium Study Space & Reading Room in Khargone",
  description:
    "Shree Sawariya Library provides a peaceful, AC-equipped, and high-productivity environment for students and professionals in Khargone. Features high-speed WiFi, personal desks, and 24/7 security.",
  openGraph: {
    title: "Shree Sawariya Library | Premium Study Space in Khargone",
    description: "Join the best library in Khargone. Peaceful environment, high-speed WiFi, and personal desks for students.",
    url: "https://www.sawariyalibrary.in",
    images: [
      {
        url: "/Bulding.webp",
        width: 1200,
        height: 630,
        alt: "Shree Sawariya Library Building",
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <div className="landing-root">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        {/* <RegistrationSection /> */}
        <FacilitiesSection />
        <GallerySection />
        <PricingSection />
        <ReviewsSection />
        <RegistrationCTA />
        <VisitUsSection />
      </main>
      <FooterSection />
    </div>
  );
}
