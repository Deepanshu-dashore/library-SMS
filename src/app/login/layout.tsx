import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Access the Shree Sawariya Library Management System dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
