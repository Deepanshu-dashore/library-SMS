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
  Trash2,
} from "lucide-react";

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
    subItems: [
      { name: "Manage Seats", path: "/seat-management" },
      { name: "Add Seat", path: "/seat-management/add" },
      { name: "Bulk Registration", path: "/seat-management/bulk-add" },
    ],
  },
  // {
  //   title: "LMS Software",
  //   path: "/lms",
  //   icon: Briefcase,
  // },
  {
    title: "Subscriptions",
    path: "/subscriptions",
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
    path: "/expenses",
    icon: CreditCard,
    subItems: [
      { name: "Manage Expenses", path: "/expenses" },
      { name: "Add Expense", path: "/expenses/add" },
    ],
  },
  {
    title: "Manage Members",
    path: "/users",
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
    title: "Recycle Bin",
    path: "/trash",
    icon: Trash2,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
