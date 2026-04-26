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
        name: "Add New Registration",
        desc: "Register a member via public form.",
        steps: [
          "Navigate to Members",
          "Click on 'Copy Registration Link'",
          "Open link in a new tab",
          "Fill all required details and submit",
        ],
        result: "Member is registered and added to the system.",
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
        name: "Add New Seat",
        desc: "Create a new individual seat for allocation.",
        steps: [
          "Navigate to Seat Management",
          "Click on 'Add Seat'",
          "Enter seat details: Seat Number, Floor, Type (AC / Non-AC), Price",
          "Click 'Save'",
        ],
        result: "The new seat is created and visible as Available in the seat grid.",
        warnings: ["Seat Number must be unique."],
      },
      {
        name: "Bulk Add Seats",
        desc: "Create multiple seats at once using a range.",
        steps: [
          "Go to Seat Management → Bulk Add",
          "Enter Prefix (e.g., S-)",
          "Enter Start Range and End Range (e.g., 1–50)",
          "Select the Floor",
          "Click 'Generate'",
        ],
        result: "Seats are created in sequence (e.g., S-1 to S-50).",
        warnings: ["Ensure seat numbers do not overlap with existing seats."],
      },
      {
        name: "Update Seat",
        desc: "Modify existing seat details.",
        steps: [
          "Open Seat Management",
          "Select the seat from the grid",
          "Edit required details",
          "Click 'Save Changes'",
        ],
        result: "Seat details are updated successfully.",
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
        name: "Add New Member",
        desc: "Register a new member in the system.",
        steps: [
          "Navigate to Members",
          "Click on 'Add Member'",
          "Fill all required sections: Personal Details, Contact Information, Address, Verification / Media",
          "Click 'Create Member Profile'",
        ],
        result: "New member is added and visible in the members list.",
      },
      {
        name: "Download Member Receipt",
        desc: "Download receipt for a member.",
        steps: [
          "Go to Members → Manage Members",
          "Click on three dots (⋮) next to the member",
          "Select 'View'",
          "Click on 'Download PDF'",
        ],
        result: "Receipt is downloaded successfully.",
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
        name: "Add Subscription",
        desc: "Assign a seat and create a subscription.",
        steps: [
          "Go to Subscriptions → Add Subscription",
          "Select Member and Seat",
          "Set Start Date and Duration",
          "Select Payment Mode",
          "Click 'Continue'",
        ],
        result: "Subscription is created and seat is assigned.",
        warnings: ["Cannot create subscription if member already has an active subscription."],
      },
      {
        name: "Check Seat Calendar",
        desc: "View seat booking timeline.",
        steps: [
          "Navigate to Subscriptions",
          "Click on 'Seat Calendar'",
          "Select desired month/year view",
        ],
        result: "Seat availability and bookings are displayed.",
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
        name: "Download Payment Receipt",
        desc: "View and print payment receipt.",
        steps: [
          "Click on three dots (⋮) for a payment",
          "Select 'View'",
          "Click 'Print Receipt'",
        ],
        result: "Payment receipt is displayed and ready for printing.",
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
        name: "Add Expense",
        desc: "Record a new expense.",
        steps: [
          "Go to Expenses → Add Expense",
          "Enter: Expense Title, Amount, Category, Transaction Date",
          "Click 'Save Expense'",
        ],
        result: "Expense is recorded successfully.",
        warnings: ["Receipt and additional notes are optional."],
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
