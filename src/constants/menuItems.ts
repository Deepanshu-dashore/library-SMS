import { Home, Users, Settings, Briefcase, FileText, LayoutDashboard, Database, CreditCard } from "lucide-react";

export const MENU_ITEMS = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Seat Management",
    path: "/seat-management",
    icon: Database,
  },
  {
    title: "LMS Software",
    path: "/lms",
    icon: Briefcase,
  },
  {
    title: "Manage Expenses",
    path: "/expenses",
    icon: CreditCard,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
