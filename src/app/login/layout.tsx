import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Shree Sawariya Library Management System",
  description: "Secure staff portal for Shree Sawariya Library, Khargone. Login to manage library operations, student records, seat allocations, and payments.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Admin Portal | Shree Sawariya Library, Khargone",
    description: "Authorized access only. Manage library operations, members, seats, and payments.",
    images: ["/Logo.png"],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
