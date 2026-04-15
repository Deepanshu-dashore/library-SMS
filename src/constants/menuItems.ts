export const MENU_ITEMS = [
  {
    title: "Dashboard",
    path: "/",
    icon: "solar:widget-bold-duotone",
  },

  // USERS FIRST (entry point)
  {
    title: "Members",
    path: "/users",
    icon: "solar:users-group-rounded-bold-duotone",
    subItems: [
      { name: "Manage Members", path: "/users" },
      { name: "Add Member", path: "/users/create" },
    ],
  },

  // RESOURCE
  {
    title: "Seat Management",
    path: "/seat-management",
    icon: "solar:chair-bold-duotone",
    subItems: [
      { name: "Manage Seats", path: "/seat-management" },
      { name: "Add Seat", path: "/seat-management/add" },
      { name: "Bulk Registration", path: "/seat-management/bulk-add" },
    ],
  },

  // CORE BUSINESS
  {
    title: "Subscriptions",
    path: "/subscriptions",
    icon: "solar:ticket-bold-duotone",
    subItems: [
      { name: "Manage Subscriptions", path: "/subscriptions" },
      { name: "Add Subscription", path: "/subscriptions/add" },
    ],
  },

  // MONEY FLOW
  {
    title: "Payments",
    icon: "solar:card-bold-duotone",
    path: "/payments",
  },

  {
    title: "Expenses",
    path: "/expenses",
    icon: "solar:wallet-bold-duotone",
    subItems: [
      { name: "Manage Expenses", path: "/expenses" },
      { name: "Add Expense", path: "/expenses/add" },
    ],
  },

  // INSIGHTS
  {
    title: "Reports",
    path: "/reports",
    icon: "solar:document-text-bold-duotone",
  },

  // LOW PRIORITY
  {
    title: "Recycle Bin",
    path: "/trash",
    icon: "solar:trash-bin-trash-bold-duotone",
  },

  {
    title: "Settings",
    path: "/settings",
    icon: "solar:settings-bold-duotone",
    subItems: [
      { name: "Profile", path: "/settings" },
      { name: "Personalization", path: "/settings/personalization" },
    ],
  },
];
