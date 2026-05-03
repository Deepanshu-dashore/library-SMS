import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Now | Join Shree Sawariya Library, Khargone",
  description: "Register for Shree Sawariya Library membership online. Get a personal study desk in Khargone's best AC library with WiFi. Ideal for UPSC, MPPSC, SSC & all competitive exam students.",
  keywords: [
    "Library registration Khargone",
    "Join Sawariya Library",
    "Sawariya Library membership",
    "Study room registration Khargone",
    "Library admission Khargone",
    "Khargone library form",
    "Register library Khargone",
    "Get seat in Khargone library",
    "Shree Sawariya Library join",
    "Library membership form Khargone",
  ],
  openGraph: {
    title: "Register & Join Shree Sawariya Library | Khargone",
    description: "Get your personal study desk in Khargone's #1 library. Register online in minutes. AC, WiFi, and 24/7 security included.",
    url: "https://www.sawariyalibrary.in/registration",
    images: [
      {
        url: "/Bulding.webp",
        width: 1200,
        height: 630,
        alt: "Join Shree Sawariya Library - Registration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Register | Shree Sawariya Library, Khargone",
    description: "Join Khargone's best study room. Silent, AC, WiFi, personal desks. Register online now!",
    images: ["/Bulding.webp"],
  },
  alternates: {
    canonical: "https://www.sawariyalibrary.in/registration",
  },
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
