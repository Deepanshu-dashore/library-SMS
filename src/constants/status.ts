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
    color: "bg-slate-50 text-slate-500 border border-slate-100",
  },
  ac: {
    label: "AC",
    color: "bg-sky-50 text-sky-600 border border-sky-100",
  },
  card: {
    label: "Card",
    color: "bg-amber-50 text-amber-600 border border-amber-100",
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
    color: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  upi: {
    label: "UPI",
    color: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  },
  income: {
    label: "Income",
    color: "bg-emerald-100/80 text-emerald-700",
  },
  expense: {
    label: "Expense",
    color: "bg-rose-100/80 text-rose-700",
  },
  split: {
    label: "Split Payment",
    color: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  },
};

export const DARK_STATUS_STYLES: Record<string, StatusStyle> = {
  unverify: {
    label: "Unverify",
    color: "bg-yellow-700/80 text-yellow-100",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-700/80 text-green-100",
  },
  active: {
    label: "Active",
    color: "bg-green-700/80 text-green-100",
  },
  inactive: {
    label: "Inactive",
    color: "bg-slate-700/80 text-slate-200",
  },
  blocked: {
    label: "Blocked",
    color: "bg-red-700/80 text-red-100",
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-700/80 text-emerald-100",
  },
  rejected: {
    label: "Rejected",
    color: "bg-rose-700/80 text-rose-100",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-700/80 text-blue-100",
  },
  completed: {
    label: "Completed",
    color: "bg-indigo-700/80 text-indigo-100",
  },
  electricity: {
    label: "Electricity",
    color: "bg-amber-700/80 text-amber-100",
  },
  water: {
    label: "Water",
    color: "bg-cyan-700/80 text-cyan-100",
  },
  rent: {
    label: "Rent",
    color: "bg-purple-700/80 text-purple-100",
  },
  maintenance: {
    label: "Maintenance",
    color: "bg-amber-700/80 text-amber-100",
  },
  normal: {
    label: "Normal",
    color: "bg-slate-700/85 text-slate-200 border border-slate-600/40",
  },
  ac: {
    label: "AC",
    color: "bg-sky-700/80 text-sky-100 border border-sky-600/30",
  },
  card: {
    label: "Card",
    color: "bg-amber-700/80 text-amber-100 border border-amber-600/30",
  },
  available: {
    label: "Available",
    color: "bg-green-700/80 text-green-100",
  },
  occupied: {
    label: "Occupied",
    color: "bg-red-700/80 text-red-100",
  },
  cash: {
    label: "Cash",
    color: "bg-emerald-700/80 text-emerald-100 border border-emerald-600/30",
  },
  upi: {
    label: "UPI",
    color: "bg-indigo-700/80 text-indigo-100 border border-indigo-600/30",
  },
  income: {
    label: "Income",
    color: "bg-emerald-700/80 text-emerald-100",
  },
  expense: {
    label: "Expense",
    color: "bg-rose-700/80 text-rose-100",
  },
  split: {
    label: "Split Payment",
    color: "bg-indigo-700/80 text-indigo-100 border border-indigo-600/30",
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

export const getDarkStatusStyle = (status: string): StatusStyle => {
  if (!status || status === "" || status === "undefined" || status === "null") {
    return { label: "Not Available", color: "bg-slate-700/80 text-slate-200" };
  }
  const lower = status.toLowerCase();
  return DARK_STATUS_STYLES[lower] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: "bg-slate-700/80 text-slate-200",
  };
};
