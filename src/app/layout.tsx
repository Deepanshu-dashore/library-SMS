import type { Metadata } from "next";
import { Geist, Geist_Mono,Public_Sans,Barlow } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "../providers/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sawariyalibrary.in"),
  title: {
    default: "Shree Sawariya Library | Best Library & Study Room in Khargone",
    template: "%s | Shree Sawariya Library"
  },
  description: "Join Shree Sawariya Library — Khargone's #1 premium study room. Fully AC, high-speed WiFi, personal desks, 24/7 security, and a peaceful environment for competitive exam aspirants and students.",
  keywords: [
    // --- Brand Variations ---
    "Sawariya Library",
    "Saawariya Library",
    "Shree Sawariya Library",
    "Shri Sawariya Library",
    "Sanwariya Library",
    "Shri Sanwariya Library",
    "Sawariya Library Khargone",
    "Saawariya Khargone",

    // --- Location Based ---
    "Library in Khargone",
    "Best library in Khargone",
    "Top library Khargone",
    "Khargone library",
    "Khargone top library",
    "Khargone study center",
    "Khargone reading room",
    "Library near me Khargone",
    "Madhya Pradesh library",
    "MP library",
    "Nimar library",

    // --- Service & Facility ---
    "Study room Khargone",
    "Reading room Khargone",
    "AC library Khargone",
    "WiFi study room Khargone",
    "Silent study room Khargone",
    "Premium library Khargone",
    "24 hour study room Khargone",
    "Personal desk library Khargone",
    "Study hall Khargone",
    "Library with AC and WiFi Khargone",

    // --- Competitive Exam Keywords ---
    "Library for competitive exams Khargone",
    "UPSC study room Khargone",
    "MPPSC library Khargone",
    "SSC study center Khargone",
    "Railway exam library Khargone",
    "Banking exam study room Khargone",
    "Government exam preparation Khargone",
    "Competitive exam preparation library MP",

    // --- Student & General Intent ---
    "Student library Khargone",
    "Affordable study room Khargone",
    "Library membership Khargone",
    "Study space Khargone",
    "Peaceful study space Khargone",
    "Productive study environment Khargone",
    "Best study place in Khargone",
    "Library near Khargone"
  ],
  authors: [{ name: "Shree Sawariya Library" }],
  creator: "Shree Sawariya Library",
  publisher: "Shree Sawariya Library",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Shree Sawariya Library | Best Library in Khargone",
    description: "Premium reading and study room in Khargone designed for high productivity and deep work. Facilities include AC, WiFi, and personal desks.",
    url: "https://www.sawariyalibrary.in",
    siteName: "Shree Sawariya Library",
    images: [
      {
        url: "/Bulding.webp",
        width: 1200,
        height: 630,
        alt: "Shree Sawariya Library Building - Premium Study Space in Khargone",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Sawariya Library | Best Library in Khargone",
    description: "Premium reading and study room in Khargone designed for high productivity and deep work.",
    images: ["/Bulding.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${barlow.variable} ${geistMono.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

