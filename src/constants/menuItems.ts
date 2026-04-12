import {
  LayoutDashboard,
  Users,
  Database,
  Ticket,
  CreditCard,
  FileText,
  Trash2,
  Settings,
  Briefcase,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },

  // 1️⃣ USERS FIRST (entry point)
  {
    title: "Members",
    path: "/users",
    icon: Users,
    subItems: [
      { name: "Manage Members", path: "/users" },
      { name: "Add Member", path: "/users/create" },
    ],
  },

  // 2️⃣ RESOURCE
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

  // 3️⃣ CORE BUSINESS
  {
    title: "Subscriptions",
    path: "/subscriptions",
    icon: Ticket,
    subItems: [
      { name: "Manage Subscriptions", path: "/subscriptions" },
      { name: "Add Subscription", path: "/subscriptions/add" },
    ],
  },

  // 4️⃣ MONEY FLOW
  {
    title: "Payments",
    icon: CreditCard,
    path: "/payments",
  },

  {
    title: "Expenses",
    path: "/expenses",
    icon: Briefcase,
    subItems: [
      { name: "Manage Expenses", path: "/expenses" },
      { name: "Add Expense", path: "/expenses/add" },
    ],
  },

  // 5️⃣ INSIGHTS
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },

  // 6️⃣ LOW PRIORITY
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
