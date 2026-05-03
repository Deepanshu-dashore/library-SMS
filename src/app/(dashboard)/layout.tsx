import { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Management dashboard for Shree Sawariya Library.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
