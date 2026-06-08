"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { TABLE_IDS } from "@/constants/tableIds";
import { useTableState } from "@/hooks/useTableState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import clsx from "clsx";

// ─── Types ─────────────────────────────────────────────────────────────────
interface PaymentRecord {
  id: string;
  receiptNumber: string;
  userId: { _id: string; name: string; email: string };
  amount: number;
  paymentMode: "cash" | "upi" | "card" | "split";
  createdAt: string;
  splitDetails: { amount: number; paymentMode: string }[];
}

interface MonthlyStatEntry {
  month: string;
  total: number;
  cash: number;
  upi: number;
  card: number;
  split: number;
}

interface ReportData {
  totals: {
    totalAmount: number;
    cash: { amount: number; count: number };
    upi: { amount: number; count: number };
    card: { amount: number; count: number };
    split: { amount: number; count: number };
  };
  monthlyStats: MonthlyStatEntry[];
  payments: PaymentRecord[];
}

// ─── Constants & Formatting ────────────────────────────────────────────────
const MONTHS = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 5 + i);

const MODE_META: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  cash:  { icon: "solar:dollar-minimalistic-bold-duotone", color: "#f59e0b", bg: "#fef9c3", label: "Cash" },
  upi:   { icon: "solar:smartphone-bold-duotone",           color: "#10b981", bg: "#d1fae5", label: "UPI" },
  card:  { icon: "solar:card-bold-duotone",                 color: "#3b82f6", bg: "#e0f2fe", label: "Card" },
  split: { icon: "solar:bill-list-bold-duotone",            color: "#f43f5e", bg: "#ffe4e6", label: "Split" },
  total: { icon: "solar:wallet-money-bold-duotone",         color: "#6366f1", bg: "#eef2ff", label: "Total Payments" }
};

function fmt(v: number) {
  return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const formatCurrency = (val: number) => {
  if (val >= 100000) return `${(val / 1000).toFixed(0)}k`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
  return val.toString();
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Stat Card Component ───────────────────────────────────────────────────
const StatCard = ({ title, value, count, icon, color, mode }: any) => (
  <div className={`p-6 rounded-2xl border flex flex-col gap-4 group transition-all duration-500 relative overflow-hidden ${mode === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/30 shadow-none' : 'bg-white border-gray-100 hover:border-indigo-100 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.20)]'}`}>
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <p className={`font-public-sans font-semibold text-sm leading-[1.57143] mb-1.5 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{title}</p>
        <h3 className={`text-3xl font-barlow font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{fmt(value)}</h3>
        <p className={`text-[11px] font-semibold mt-1 leading-tight ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{count} Transactions</p>
      </div>
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon icon={icon} width={24} height={24} />
      </div>
    </div>
  </div>
);

// ─── Custom Chart Tooltip ──────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.3)] border border-slate-700 overflow-hidden min-w-[140px]">
        <div className="bg-slate-700 px-3 py-1.5 text-center">
          <span className="text-xs font-semibold text-gray-300 capitalize">{label}</span>
        </div>
        <div className="p-3 space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[11px] font-semibold text-gray-400 capitalize">{entry.name}:</span>
              </div>
              <span className="text-xs font-medium text-white tracking-tight">{fmt(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// ─── Custom Stacked Bar Shape with Rounded Top/Bottom Boundaries ───────────
const CustomBarShape = (props: any) => {
  const { fill, x, y, width, height, payload, dataKey } = props;
  if (!height || height <= 0) return null;

  // Stacking order from bottom to top: upi, cash, card, split
  const stackOrder = ["upi", "cash", "card", "split"];
  
  // Find which keys are active (non-zero) for this specific data point
  const activeKeys = stackOrder.filter(key => payload[key] && payload[key] > 0);

  const isBottom = activeKeys.length > 0 && activeKeys[0] === dataKey;
  const isTop = activeKeys.length > 0 && activeKeys[activeKeys.length - 1] === dataKey;

  const maxRadius = Math.min(4, height / 2, width );

  let radius: [number, number, number, number] = [0, 0, 0, 0];
  if (isBottom && isTop) {
    radius = [maxRadius, maxRadius, maxRadius, maxRadius];
  } else if (isBottom) {
    radius = [0, 0, maxRadius, maxRadius];
  } else if (isTop) {
    radius = [maxRadius, maxRadius, 0, 0];
  }

  const [tl, tr, br, bl] = radius;
  
  const path = `
    M ${x},${y + tl}
    A ${tl},${tl} 0 0 1 ${x + tl},${y}
    L ${x + width - tr},${y}
    A ${tr},${tr} 0 0 1 ${x + width},${y + tr}
    L ${x + width},${y + height - br}
    A ${br},${br} 0 0 1 ${x + width - br},${y + height}
    L ${x + bl},${y + height}
    A ${bl},${bl} 0 0 1 ${x},${y + height - bl}
    Z
  `;

  return <path d={path} fill={fill} />;
};

// ─── Main Payment Report Page ──────────────────────────────────────────────
export default function PaymentReportPage() {
  const router = useRouter();
  const { color: themeColor, mode } = useSelector((state: any) => state.theme);
  const { currentUser } = useSelector((state: any) => state.user);
  
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"line" | "bar">("bar");
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [chartModeFilter, setChartModeFilter] = useState<"all" | "cash" | "upi" | "card" | "split">("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sharingId, setSharingId] = useState<string | null>(null);

  const handleShareReceipt = async (payment: PaymentRecord) => {
    setSharingId(payment.id);
    try {
      const res = await fetch(`/api/payment/${payment.id}/share-link`);
      const result = await res.json();
      
      if (result.success) {
        const url = result.link;
        const capitalizedName = payment.userId?.name.replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Deleted User";
        const shareText = `*Payment Received:* ₹${payment.amount.toLocaleString('en-IN')} (Receipt #${payment.receiptNumber})\n\n` +
                         `Hi ${capitalizedName}, your payment has been successfully received.\n\n` +
                         `*Download receipt:*\n${url}\n\n` +
                         `Link valid for 24 hrs.`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Payment Receipt',
              text: shareText,
            });
          } catch (error) {
            navigator.clipboard.writeText(shareText);
            toast.success("Receipt link copied!");
          }
        } else {
          navigator.clipboard.writeText(shareText);
          toast.success("Receipt link copied!");
        }
      } else {
        toast.error(result.message || "Failed to generate share link");
      }
    } catch (error) {
      toast.error("An error occurred while sharing");
    } finally {
      setSharingId(null);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ year: String(selectedYear) });
      if (selectedMonth > 0) {
        params.set("month", String(selectedMonth));
      }
      const res = await fetch(`/api/payment-report?${params}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
      } else {
        toast.error(json.message || "Failed to load report data");
      }
    } catch {
      toast.error("An error occurred while fetching report data");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totals = useMemo(() => {
    if (!data) return { totalAmount: 0, cash: { amount: 0, count: 0 }, upi: { amount: 0, count: 0 }, card: { amount: 0, count: 0 }, split: { amount: 0, count: 0 } };
    return data.totals;
  }, [data]);

  const filteredPayments = useMemo(() => {
    if (!data) return [];
    let paymentsList = data.payments;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      paymentsList = paymentsList.filter(
        (p) =>
          (p.userId && p.userId.name.toLowerCase().includes(query)) ||
          (p.receiptNumber && p.receiptNumber.toLowerCase().includes(query))
      );
    }
    return paymentsList;
  }, [data, searchQuery]);

  // Columns for the payments table
  const columns: ColumnDef<PaymentRecord>[] = [
    {
      key: "userId",
      label: "Member",
      type: "user",
      getTitle: (row) => row.userId?.name || "Deleted User",
      getSubtitle: (row) => row.userId?.email || "No email",
      getAvatar: (row) => row.userId?.name?.charAt(0) || "?",
      sortable: true
    },
    {
      key: "amount",
      label: "Amount",
      type: "custom",
      render: (row) => (
        <span className="font-semibold font-barlow">₹{row.amount.toLocaleString()}</span>
      ),
      sortable: true
    },
    {
      key: "paymentMode",
      label: "Mode",
      type: "custom",
      render: (row: any) => {
        if (row.paymentMode === "split") {
          return (
            <div className="flex flex-col gap-1 group relative">
               <StatusBadge status="split" size="xs" />
               <div className={clsx(
                 "hidden group-hover:block absolute left-0 top-full mt-2 z-50 shadow-xl border rounded-lg p-2 min-w-[120px]",
                 mode === "dark" ? "bg-[#1c252e] border-gray-800 text-white" : "bg-white border-gray-100 text-gray-900"
               )}>
                  {row.splitDetails?.map((d: any, i: number) => (
                    <div key={i} className={clsx(
                      "flex justify-between gap-4 text-[10px] font-medium py-0.5 border-b last:border-0",
                      mode === "dark" ? "border-gray-800/60" : "border-gray-50"
                    )}>
                      <span className={clsx("capitalize", mode === "dark" ? "text-gray-400" : "text-gray-500")}>{d.paymentMode}</span>
                      <span className={clsx("font-bold font-barlow", mode === "dark" ? "text-slate-200" : "text-gray-900")}>₹{d.amount}</span>
                    </div>
                  ))}
               </div>
            </div>
          );
        }
        return <StatusBadge status={row.paymentMode} size="xs" />;
      },
      sortable: true
    },
    {
      key: "receiptNumber",
      label: "Receipt No.",
      type: "text",
      className: "font-barlow"
    },
    {
      key: "createdAt",
      label: "Payment Date",
      type: "date",
      getDate: (row) => row.createdAt,
      sortable: true
    },
    {
      key: "share",
      label: "Share",
      type: "custom",
      align: "center",
      render: (row) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleShareReceipt(row);
          }}
          variant="primary"
          size="sm"
          isLoading={sharingId === row.id}
          icon="solar:whatsapp-line-duotone"
          className={clsx(
            "h-8 w-18! font-medium",
            mode === "dark" ? "bg-indigo-600 hover:bg-indigo-700 shadow-none border-indigo-600 text-white" : ""
          )}
        >
          Share
        </Button>
      )
    }
  ];

  // Excel and PDF Export
  const handleDownloadPDF = async () => {
    if (!data) return;

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const libraryName = currentUser?.libraryName || currentUser?.name || "Library SMS";
      const now = new Date();
      const formalDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s/g, "-");
      const formalTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).replace(/[:\s]/g, "-");
      const filename = `Payment_Report_${formalDate}_${formalTime}.pdf`;

      // Logo Handling
      if (currentUser?.profileImage) {
        try {
          const img = new Image();
          img.src = currentUser.profileImage;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          if (img.complete && img.naturalWidth > 0) {
            doc.addImage(img, 'PNG', 14, 15, 12, 12);
          }
        } catch (e) {
          console.error(e);
        }
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(libraryName, 14, (currentUser?.profileImage ? 33 : 22));

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("Subscription Payments Report", 14, (currentUser?.profileImage ? 39 : 28));

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${now.toLocaleString("en-IN")}`, doc.internal.pageSize.width - 14, 22, { align: "right" });
      doc.text(`Period: ${selectedYear} ${selectedMonth > 0 ? MONTHS[selectedMonth] : "(All Months)"}`, doc.internal.pageSize.width - 14, 27, { align: "right" });

      // Table of Totals
      autoTable(doc, {
        startY: (currentUser?.profileImage ? 46 : 35),
        head: [["Payment Mode", "Total Transactions", "Total Amount"]],
        body: [
          ["Total Payments", totals.cash.count + totals.upi.count + totals.card.count + totals.split.count, fmt(totals.totalAmount)],
          ["Cash", totals.cash.count, fmt(totals.cash.amount)],
          ["UPI", totals.upi.count, fmt(totals.upi.amount)],
          ["Card", totals.card.count, fmt(totals.card.amount)],
          ["Split Payments", totals.split.count, fmt(totals.split.amount)],
        ],
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241], textColor: 255, fontSize: 10, fontStyle: "bold" },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 1: { halign: "center" }, 2: { halign: "right" } }
      });

      // Transactions Table
      const tableData = filteredPayments.map((p) => [
        p.receiptNumber,
        p.userId ? p.userId.name : "Walk-in Guest",
        p.paymentMode.toUpperCase(),
        fmtDate(p.createdAt),
        fmt(p.amount)
      ]);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("Detailed Transaction List", 14, (doc as any).lastAutoTable.finalY + 12);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 16,
        head: [["Receipt No", "Member Name", "Mode", "Date", "Amount"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [30, 41, 59], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: { 4: { halign: "right" } }
      });

      doc.save(filename);
      toast.success("PDF report generated successfully");
      setShowExportMenu(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleDownloadExcel = async () => {
    if (!data) return;

    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const now = new Date();
      const formalDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s/g, "-");
      const formalTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).replace(/[:\s]/g, "-");
      const filename = `Payment_Report_${formalDate}_${formalTime}.xlsx`;

      // 1. Summary Sheet
      const summaryRows = [
        ["PAYMENT ANALYTICS REPORT"],
        [],
        ["Property", "Value"],
        ["Report Period", `${selectedYear} ${selectedMonth > 0 ? MONTHS[selectedMonth] : "(All Months)"}`],
        ["Generated At", now.toLocaleString()],
        [],
        ["Payment Mode", "Transactions Count", "Amount"],
        ["Total Payments", totals.cash.count + totals.upi.count + totals.card.count + totals.split.count, totals.totalAmount],
        ["Cash", totals.cash.count, totals.cash.amount],
        ["UPI", totals.upi.count, totals.upi.amount],
        ["Card", totals.card.count, totals.card.amount],
        ["Split Payments", totals.split.count, totals.split.amount],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
      wsSummary["!cols"] = [{ wch: 25 }, { wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      // 2. Transactions Sheet
      const transactionRows = [
        ["DETAILED PAYMENTS LIST"],
        [],
        ["Receipt No", "Member Name", "Email", "Payment Mode", "Date", "Amount", "Breakdown Details"],
        ...filteredPayments.map(p => [
          p.receiptNumber,
          p.userId ? p.userId.name : "Walk-in Guest",
          p.userId ? p.userId.email : "",
          p.paymentMode.toUpperCase(),
          fmtDate(p.createdAt),
          p.amount,
          p.paymentMode === "split" ? p.splitDetails?.map(d => `${d.paymentMode.toUpperCase()}: ${d.amount}`).join(", ") : ""
        ])
      ];
      const wsTx = XLSX.utils.aoa_to_sheet(transactionRows);
      wsTx["!cols"] = [{ wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsTx, "Transactions");

      XLSX.writeFile(wb, filename);
      toast.success("Excel sheet generated successfully");
      setShowExportMenu(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate Excel report");
    }
  };

  // Stacked chart or single value chart mapping based on chartModeFilter
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.monthlyStats;
  }, [data]);

  const activeColor = useMemo(() => {
    return MODE_META[chartModeFilter]?.color || themeColor;
  }, [chartModeFilter, themeColor]);

  const activeLabel = useMemo(() => {
    return MODE_META[chartModeFilter]?.label || "Total Payments";
  }, [chartModeFilter]);

  return (
    <div className="flex flex-col h-full overflow-auto font-public-sans pb-10">
      <PageHeader
        title="Payment Report"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Payments", href: "/payments" },
          { label: "Report" }
        ]}
        actionNode={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className={`text-sm border rounded-lg px-3 py-2 font-medium h-9 outline-none focus:ring-2 transition-all ${mode === 'dark' ? 'border-slate-600 bg-slate-800 text-gray-200 focus:ring-slate-600' : 'border-gray-200 bg-white text-gray-700 focus:ring-indigo-100'}`}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className={`text-sm border rounded-lg px-3 py-2 font-medium h-9 outline-none focus:ring-2 transition-all ${mode === 'dark' ? 'border-slate-600 bg-slate-800 text-gray-200 focus:ring-slate-600' : 'border-gray-200 bg-white text-gray-700 focus:ring-indigo-100'}`}
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>

            {/* Download Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                icon="solar:download-bold"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                Export Report
              </Button>
              <AnimatePresence>
                {showExportMenu && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowExportMenu(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 overflow-hidden border ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
                    >
                      <button
                        onClick={handleDownloadPDF}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${mode === 'dark' ? 'text-gray-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-slate-50'}`}
                      >
                        <Icon icon="solar:document-text-bold" className="text-indigo-500 text-lg" />
                        Export as PDF
                      </button>
                      <div className={`h-px ${mode === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`} />
                      <button
                        onClick={handleDownloadExcel}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${mode === 'dark' ? 'text-gray-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-slate-50'}`}
                      >
                        <Icon icon="solar:file-text-bold" className="text-emerald-500 text-lg" />
                        Export as Excel
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        }
      />

      <div className={`border-b mb-8 ${mode === 'dark' ? 'border-slate-700' : 'border-gray-100'}`} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-400 font-medium tracking-tight">Fetching payment report...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Card Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Payments" value={totals.totalAmount} count={totals.cash.count + totals.upi.count + totals.card.count + totals.split.count} icon={MODE_META.total.icon} color={MODE_META.total.color} mode={mode} />
            <StatCard title="Cash Payments" value={totals.cash.amount} count={totals.cash.count} icon={MODE_META.cash.icon} color={MODE_META.cash.color} mode={mode} />
            <StatCard title="UPI Payments" value={totals.upi.amount} count={totals.upi.count} icon={MODE_META.upi.icon} color={MODE_META.upi.color} mode={mode} />
            <StatCard title="Card Payments" value={totals.card.amount} count={totals.card.count} icon={MODE_META.card.icon} color={MODE_META.card.color} mode={mode} />
            <StatCard title="Split Payments" value={totals.split.amount} count={totals.split.count} icon={MODE_META.split.icon} color={MODE_META.split.color} mode={mode} />
          </div>

          {/* Interactive Chart Section */}
          <div className={`rounded-3xl p-8 border transition-all duration-300 ${mode === 'dark' ? 'bg-slate-800 border-slate-700 shadow-none' : 'bg-white border-gray-100 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex flex-col gap-0.5">
                <h2 className={`text-lg font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment Statistics</h2>
                <p className={`text-xs font-medium ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Monthly payments breakdown for the year {selectedYear}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Payment Mode Chart Filter */}
                <select
                  value={chartModeFilter}
                  onChange={e => setChartModeFilter(e.target.value as any)}
                  className={`text-xs border rounded-lg px-3 py-1.5 font-bold h-8 outline-none focus:ring-2 transition-all capitalize ${mode === 'dark' ? 'border-slate-600 bg-slate-700 text-gray-200 focus:ring-slate-600' : 'border-gray-200 bg-gray-50 text-gray-700 focus:ring-indigo-100'}`}
                >
                  <option value="all">All Modes</option>
                  <option value="cash">Cash Only</option>
                  <option value="upi">UPI Only</option>
                  <option value="card">Card Only</option>
                  <option value="split">Split Only</option>
                </select>

                {/* Line vs Bar toggle */}
                <div className={`flex items-center gap-1 border rounded-lg p-0.5 h-8 ${mode === 'dark' ? 'border-slate-600 bg-slate-700/50' : 'border-gray-100 bg-gray-50/50'}`}>
                  <button 
                    onClick={() => setChartType("bar")} 
                    className={`px-3 py-0.5 h-full text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${chartType === "bar" ? (mode === 'dark' ? "bg-slate-600 text-white shadow-sm" : "bg-white text-gray-800 shadow-sm") : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Icon icon="solar:chart-square-bold" width={14} />
                    Bar
                  </button>
                  <button 
                    onClick={() => setChartType("line")} 
                    className={`px-3 py-0.5 h-full text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${chartType === "line" ? (mode === 'dark' ? "bg-slate-600 text-white shadow-sm" : "bg-white text-gray-800 shadow-sm") : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Icon icon="solar:graph-bold" width={14} />
                    Line
                  </button>
                </div>
              </div>
            </div>

            {/* Total Indicators */}
            <div className="flex gap-10 mt-6 mb-8">
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-xs font-semibold ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor }} />
                  {activeLabel}
                </div>
                <p className={`text-xl font-bold font-barlow ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {fmt(chartModeFilter === "all" ? totals.totalAmount : totals[chartModeFilter].amount)}
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" className="-ml-6" height={280}>
              {chartType === "bar" ? (
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === 'dark' ? '#334155' : '#f3f4f6'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: mode === 'dark' ? '#94a3b8' : '#9ca3af', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: mode === 'dark' ? '#94a3b8' : '#9ca3af', fontWeight: 700 }} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} />
                  
                  {chartModeFilter === "all" ? (
                    <>
                      <Bar dataKey="upi" stackId="a" fill="#10b981" shape={<CustomBarShape />} name="UPI" />
                      <Bar dataKey="cash" stackId="a" fill="#f59e0b" shape={<CustomBarShape />} name="Cash" />
                      <Bar dataKey="card" stackId="a" fill="#3b82f6" shape={<CustomBarShape />} name="Card" />
                      <Bar dataKey="split" stackId="a" fill="#f43f5e" shape={<CustomBarShape />} name="Split" />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 15 }} />
                    </>
                  ) : (
                    <Bar dataKey={chartModeFilter} fill={activeColor} radius={[4, 4, 4, 4]} name={activeLabel} />
                  )}
                </BarChart>
              ) : (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotalMode" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColor} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === 'dark' ? '#334155' : '#f3f4f6'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: mode === 'dark' ? '#94a3b8' : '#9ca3af', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: mode === 'dark' ? '#94a3b8' : '#9ca3af', fontWeight: 700 }} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {chartModeFilter === "all" ? (
                    <>
                      <Area type="monotone" name="Total Payments" dataKey="total" stroke={themeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorTotalMode)" />
                      <Line type="monotone" name="Cash" dataKey="cash" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line type="monotone" name="UPI" dataKey="upi" stroke="#10b981" strokeWidth={2} dot={false} />
                      <Line type="monotone" name="Card" dataKey="card" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" name="Split" dataKey="split" stroke="#f43f5e" strokeWidth={2} dot={false} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 15 }} />
                    </>
                  ) : (
                    <Area type="monotone" name={activeLabel} dataKey={chartModeFilter} stroke={activeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorTotalMode)" />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
              <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Payments Ledger
              </h2>
              {/* Table search filter */}
              <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl w-full sm:w-72 transition-all ${mode === 'dark' ? 'border-slate-700 bg-slate-800 focus-within:border-indigo-500' : 'border-gray-200 bg-white focus-within:border-indigo-500'}`}>
                <Icon icon="solar:magnifer-linear" className="text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by name or receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-700 placeholder-gray-400 font-public-sans"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                    <Icon icon="solar:close-circle-bold" />
                  </button>
                )}
              </div>
            </div>

            <DataTable
              data={filteredPayments}
              columns={columns}
              loading={loading}
              rowKey={(row) => row.id}
              hideSearch={true}
              hiddenActions={['edit', 'delete']}
              onView={(row) => {
                router.push(`/payments/${row.id}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
