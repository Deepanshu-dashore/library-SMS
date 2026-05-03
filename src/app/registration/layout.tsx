import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Registration",
  description: "Register for Shree Sawariya Library membership. Join the best study space in Khargone today.",
  openGraph: {
    title: "Join Shree Sawariya Library | Student Registration",
    description: "Start your productive journey today. Register for a seat at Shree Sawariya Library, Khargone.",
    url: "https://www.sawariyalibrary.in/registration",
    images: [
      {
        url: "/Bulding.webp",
        width: 1200,
        height: 630,
        alt: "Registration - Shree Sawariya Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Registration | Shree Sawariya Library",
    description: "Join the most peaceful and productive study environment in Khargone.",
    images: ["/Bulding.webp"],
  },
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
