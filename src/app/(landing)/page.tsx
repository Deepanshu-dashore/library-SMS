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
  title: "Shree Sawariya Library | Best Study Room & Library in Khargone, MP",
  description:
    "Shree Sawariya Library is Khargone's top-rated study center. AC-equipped, silent reading rooms with high-speed WiFi, personal desks, CCTV security, and flexible membership plans. Perfect for UPSC, MPPSC, SSC & banking exam preparation.",
  keywords: [
    "Sawariya Library",
    "Saawariya Library",
    "Shree Sawariya Library",
    "Khargone library",
    "Khargone top library",
    "Best library Khargone",
    "Library near me Khargone",
    "Study room Khargone",
    "Reading room Khargone",
    "UPSC library Khargone",
    "MPPSC study center Khargone",
    "Competitive exam library Khargone",
    "AC study room Khargone",
    "Silent library Khargone",
    "Library membership Khargone",
  ],
  openGraph: {
    title: "Shree Sawariya Library | #1 Study Room in Khargone",
    description: "Khargone's best library — silent, AC-equipped, WiFi-enabled. Ideal for competitive exam preparation. Join today!",
    url: "https://www.sawariyalibrary.in",
    images: [
      {
        url: "/Bulding.webp",
        width: 1200,
        height: 630,
        alt: "Shree Sawariya Library Building - Best Study Space in Khargone",
      },
    ],
  },
  alternates: {
    canonical: "https://www.sawariyalibrary.in",
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
