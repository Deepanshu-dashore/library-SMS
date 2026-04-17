export type StatusStyle = {
  label: string;
  color: string;
};

export const STATUS_STYLES: Record<string, StatusStyle> = {
  unverify: {
    label: "Unverify",
    color: "bg-yellow-100 text-yellow-800",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800",
  },
  active: {
    label: "Active",
    color: "bg-green-100 text-green-700",
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-700",
  },
  blocked: {
    label: "Blocked",
    color: "bg-red-100 text-red-700",
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-100 text-emerald-700",
  },
  rejected: {
    label: "Rejected",
    color: "bg-rose-100 text-rose-700",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Completed",
    color: "bg-indigo-100 text-indigo-700",
  },
  electricity: {
    label: "Electricity",
    color: "bg-amber-100 text-amber-700",
  },
  water: {
    label: "Water",
    color: "bg-cyan-100 text-cyan-700",
  },
  rent: {
    label: "Rent",
    color: "bg-purple-100 text-purple-700",
  },
  maintenance: {
    label: "Maintenance",
    color: "bg-amber-100 text-amber-700",
  },
  normal: {
    label: "Normal",
    color: "bg-gray-100 text-gray-700",
  },
  ac: {
    label: "AC",
    color: "bg-blue-100 text-blue-700",
  },
  card: {
    label: "Card",
    color: "bg-amber-100 text-amber-700",
  },
  available: {
    label: "Available",
    color: "bg-green-100 text-green-700",
  },
  occupied: {
    label: "Occupied",
    color: "bg-red-100 text-red-700",
  },
  cash: {
    label: "Cash",
    color: "bg-emerald-100/80 text-emerald-700",
  },
  upi: {
    label: "UPI",
    color: "bg-indigo-100/80 text-indigo-700",
  },
  income: {
    label: "Income",
    color: "bg-emerald-100/80 text-emerald-700",
  },
  expense: {
    label: "Expense",
    color: "bg-rose-100/80 text-rose-700",
  },
};

export const getStatusStyle = (status: string): StatusStyle => {
  if (!status || status === "" || status === "undefined" || status === "null") {
    return { label: "Not Available", color: "bg-gray-100 text-gray-700" };
  }
  const lower = status.toLowerCase();
  return STATUS_STYLES[lower] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: "bg-gray-100 text-gray-700",
  };
};
