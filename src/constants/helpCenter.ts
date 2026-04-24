export const helpModules = [
  {
    id: "dashboard",
    title: "Dashboard Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    link: "/",
    description:
      "The central hub for real-time library operations, occupancy, and revenue metrics.",
    features: [
      {
        name: "Live Insights",
        desc: "Displays current seat occupancy, daily revenue, active members, and quick status metrics.",
      },
      {
        name: "Quick Actions",
        desc: "Shortcuts to register members, collect payments, and allocate seats swiftly right from the top.",
      },
      {
        name: "Trends & Charts",
        desc: "Visual representations of joining ratios and cash flow over different time periods.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Monitor Live Occupancy",
        desc: "Check the top grid to see real-time seat status. Green indicates available seats, while blue shows occupied spots.",
      },
      {
        step: 2,
        title: "Track Revenue Trends",
        desc: "Scroll to the 'Balance Statistics' chart to view monthly income vs expenses. Use the range filter to see year-to-date data.",
      },
      {
        step: 3,
        title: "Use Quick Actions",
        desc: "Locate the horizontal toolbar at the top for one-click access to member registration and payment modules.",
      },
    ],
  },
  {
    id: "registration",
    title: "Registration & LMS",
    icon: "solar:user-id-bold-duotone",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    link: "/registration",
    description:
      "Comprehensive portal for member onboarding and status inquiry.",
    features: [
      {
        name: "Member Registration",
        desc: "A multi-step, split-screen form to capture member details, documents, photo, and initial plans.",
      },
      {
        name: "Status Tracker",
        desc: "Allows members or staff to quickly verify onboarding status, assigned seat, and payment status.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Enter Personal Details",
        desc: "Fill out the multi-step form with member name, contact info, and identity proof.",
        image:
          "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Capture Profile Photo",
        desc: "Use the integrated camera module to take a live photo or upload a file for the ID card.",
        image:
          "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 3,
        title: "Select Subscription Plan",
        desc: "Choose the starting plan and assign a seat before finalizing the registration.",
        image:
          "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    id: "seat-management",
    title: "Seat Management",
    icon: "solar:sofa-bold-duotone",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    link: "/seats",
    description:
      "Manage physical seating infrastructure across multiple floors.",
    features: [
      {
        name: "Seat Layout Grid",
        desc: "A detailed visual view of all seats with their occupancy statuses (Occupied, Available, Maintenance).",
      },
      {
        name: "Bulk Addition",
        desc: "Quickly generate and assign multiple seats configured sequentially.",
      },
      {
        name: "Seat Calendar",
        desc: "A timeline module visualizing bookings over weeks/months to manage future availability.",
      },
    ],
    manual: [
      {
        name: "Add Seat",
        desc: "Create a new individual seat for allocation.",
        steps: [
          "Navigate to Seat Management",
          "Click on 'Add Seat'",
          "Fill seat details (Seat Number, Floor, Type, Price)",
          "Click Save",
        ],
        result: "New seat appears in grid with status 'Available'",
        warnings: [
          "Seat number must be unique",
          "Incorrect price will affect billing",
        ],
      },
      {
        name: "Bulk Add Seats",
        desc: "Generate multiple seats quickly using prefix and range.",
        steps: [
          "Go to Seat Management → Bulk Add",
          "Enter prefix (e.g., S-)",
          "Enter start and end range (e.g., 1–50)",
          "Select floor",
          "Click Generate",
        ],
        result: "Multiple seats created in sequence (S-1 to S-50)",
        warnings: [
          "Avoid overlapping with existing seat numbers",
          "Double-check range before generating",
        ],
      },
      {
        name: "Update Seat",
        desc: "Modify existing seat details.",
        steps: [
          "Open Seat Management",
          "Click on a seat",
          "Edit details",
          "Save changes",
        ],
        result: "Seat details updated successfully",
        warnings: [
          "Avoid editing occupied seats",
          "Do not frequently change seat number",
        ],
      },
      {
        name: "Seat Calendar",
        desc: "View seat bookings across dates.",
        steps: [
          "Go to Seat Calendar",
          "Select month or year view",
          "Check seat occupancy timeline",
        ],
        result: "You can see booked and available seats by date",
        warnings: ["Always check before assigning future booking"],
      },
    ],
  },
  {
    id: "users",
    title: "Member Management",
    icon: "solar:users-group-rounded-bold-duotone",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    link: "/users",
    description:
      "A centralized directory for maintaining, searching, and updating all library member records.",
    features: [
      {
        name: "Member Directory",
        desc: "Data grid of all members with deep filtering by Active, Expired, or Pending states.",
      },
      {
        name: "Member Profile",
        desc: "Detailed page displaying user information, payment history, and active seat logs.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Filter Member Status",
        desc: "Use the top tabs to quickly isolate members based on their subscriptions.",
        image:
          "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Detailed Profile Audit",
        desc: "Click on any member row to view their entire history and uploaded documents.",
        image:
          "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    icon: "solar:card-2-bold-duotone",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: "/subscriptions",
    description:
      "Handle the lifecycle of member plans, handling shift lengths, expiry notices, and seat transfers.",
    features: [
      {
        name: "Active Plans",
        desc: "Database of all ongoing subscriptions, mapping when users will require renewals.",
      },
      {
        name: "Renewals & Transfers",
        desc: "One-click processing for renewals or shifting a user from one seat to another.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Initiate Renewal",
        desc: "Locate an expired member and click 'Renew'. Confirm the duration and payment mode.",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Process Seat Transfer",
        desc: "Move a member to a different seat without resetting their existing period.",
        image:
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    id: "payments",
    title: "Financial Payments",
    icon: "solar:wallet-money-bold-duotone",
    color: "text-green-500",
    bg: "bg-green-500/10",
    link: "/payments",
    description:
      "Core accounting center tracking inwards revenue from plans, penalties, and registrations.",
    features: [
      {
        name: "Transaction History",
        desc: "Chronological ledger of all payments associated with UPI, Cash, or Card modes.",
      },
      {
        name: "Digital Receipts",
        desc: "Download professional A4-friendly invoices with verified digital signatures.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Review Daily Ledger",
        desc: "Check the transaction list for daily revenue reconciliations.",
        image:
          "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Generate Digital Invoices",
        desc: "Click 'Download Invoice' on any payment record for member records.",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    id: "banking",
    title: "Expenses & Banking",
    icon: "solar:banknote-2-bold-duotone",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    link: "/banking",
    description:
      "Maintain cash outflows, categorized operation costs, and review aggregate bank deposits.",
    features: [
      {
        name: "Expense Tracking",
        desc: "Log operation overheads (electricity, rent) to offset total profit.",
      },
      {
        name: "Banking Overview",
        desc: "Review margins, deposits, and digital vs cash balances.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Log System Expense",
        desc: "Navigate to the Expense section, select a category, and enter the amount spent.",
        image:
          "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Analyze Profit Margins",
        desc: "Use the Banking summary to see net profit after deducting expenses from revenue.",
        image:
          "https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings & Setup",
    icon: "solar:settings-bold-duotone",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    link: "/settings",
    description:
      "Global module configuring application appearance, organization branding, and essential support data.",
    features: [
      {
        name: "Organization Branding",
        desc: "Configure library name, logo, and digital signatures for automated receipts.",
      },
      {
        name: "Personalization",
        desc: "Switch themes, adjust sidebar orientation, and manage system preferences.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Update Library Logo",
        desc: "Upload your official logo in the Branding tab of Settings to personalize all PDFs.",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Configure Support Info",
        desc: "Add your library hotline and email to appear on member dashboard footers.",
        image:
          "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    id: "trash",
    title: "Recycle Bin",
    icon: "solar:trash-bin-trash-bold-duotone",
    color: "text-red-500",
    bg: "bg-red-500/10",
    link: "/trash",
    description:
      "Protection layer ensuring accidentally deleted infrastructure isn't permanently lost.",
    features: [
      {
        name: "Soft Deletion",
        desc: "Safely move members or seats to the trash instead of permanent hard deletion.",
      },
      {
        name: "Instant Recovery",
        desc: "Restore deleted records with one click, preserving all historical data and photos.",
      },
    ],
    manual: [
      {
        step: 1,
        title: "Recover a Member",
        desc: "Find the deleted member in the Recycle Bin and click the 'Restore' icon.",
        image:
          "https://images.unsplash.com/photo-1555854817-5b236011912b?auto=format&fit=crop&q=80&w=800",
      },
      {
        step: 2,
        title: "Purge Database",
        desc: "Use the 'Hard Delete' option to permanently remove records and clear storage.",
        image:
          "https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
];
