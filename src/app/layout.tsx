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
  title: "Shree Sawariya Library | Best Library & Study Room in Khargone",
  description: "Join Shree Sawariya Library, the best library in Khargone. A premium, fully air-conditioned reading room with high-speed WiFi, personal desks, and a peaceful environment for students and professionals.",
  keywords: [
    "Shree Sawariya Library", 
    "Library in Khargone", 
    "Best library in Khargone", 
    "Reading room Khargone", 
    "Study room Khargone", 
    "AC library Khargone", 
    "Library for competitive exams",
    "Peaceful study space Khargone"
  ],
  authors: [{ name: "Shree Sawariya Library" }],
  openGraph: {
    title: "Shree Sawariya Library | Best Library in Khargone",
    description: "Premium reading and study room in Khargone designed for high productivity and deep work. Facilities include AC, WiFi, and personal desks.",
    siteName: "Shree Sawariya Library",
    images: [
      {
        url: "/landing/interior/interior.png",
        width: 1200,
        height: 630,
        alt: "Shree Sawariya Library Interior",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Sawariya Library | Best Library in Khargone",
    description: "Premium reading and study room in Khargone designed for high productivity and deep work.",
    images: ["/landing/interior/interior.png"],
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

