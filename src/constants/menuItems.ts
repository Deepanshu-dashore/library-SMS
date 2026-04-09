import {
  Home,
  Users,
  Settings,
  Briefcase,
  FileText,
  LayoutDashboard,
  Database,
  CreditCard,
  Ticket,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Seat Management",
    icon: Database,
    subItems: [
      { name: "Manage Seats", path: "/seat-management" },
      { name: "Add Seat", path: "/seat-management/add" },
      { name: "Bulk Registration", path: "/seat-management/bulk-add" },
    ],
  },
  {
    title: "LMS Software",
    path: "/lms",
    icon: Briefcase,
  },
  {
    title: "Subscriptions",
    icon: Ticket,
    subItems: [
      { name: "Manage Subscriptions", path: "/subscriptions" },
      { name: "Add Subscription", path: "/subscriptions/add" },
    ],
  },
  {
    title: "Payments",
    icon: CreditCard,
    path: "/payments",
  },
  {
    title: "Manage Expenses",
    icon: CreditCard,
    subItems: [
      { name: "Manage Expenses", path: "/expenses" },
      { name: "Add Expense", path: "/expenses/add" },
    ],
  },
  {
    title: "Manage Members",
    icon: Users,
    subItems: [
      { name: "Manage Members", path: "/users" },
      { name: "Add Member", path: "/users/create" },
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
