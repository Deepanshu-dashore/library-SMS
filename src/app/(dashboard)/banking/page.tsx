"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  status: string;
}
interface CategoryData { name: string; amount: number; fill?: string }
interface MonthlyStatEntry { month: string; income: number; expense: number }
interface BankingData {
  totals: { totalIncome: number; totalExpense: number; balance: number };
  expenseCategories: CategoryData[];
  monthlyStats: MonthlyStatEntry[];
  transactions: Transaction[];
}

// ─── Constants ──────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  electricity: { icon: "solar:bolt-bold-duotone",   color: "#f59e0b", bg: "#fef9c3" },
  rent:        { icon: "solar:home-bold-duotone",       color: "#6366f1", bg: "#eef2ff" },
  water:       { icon: "solar:waterdrop-bold-duotone",     color: "#22d3ee", bg: "#ecfeff" },
  maintenance: { icon: "fa-solid:tools",     color: "#8b5cf6", bg: "#f5f3ff" },
  other:       { icon: "solar:bill-list-bold-duotone",          color: "#64748b", bg: "#f1f5f9" },
};

const INCOME_META = { icon: "solar:wallet-money-bold-duotone", color: "#10b981", bg: "#d1fae5" };
const EXPENSE_FALLBACK = { icon: "solar:wallet-money-bold-duotone",     color: "#f43f5e", bg: "#ffe4e6" };

const CHART_COLORS = [
  { start: "#00a76f", end: "#007867" }, 
  { start: "#8b5cf6", end: "#6d28d9" }, 
  { start: "#f59e0b", end: "#b45309" }, 
  { start: "#f43f5e", end: "#be123c" }, 
  { start: "#3b82f6", end: "#1d4ed8" }, 
  { start: "#14b8a6", end: "#0f766e" }, 
  { start: "#ec4899", end: "#be185d" }, 
  { start: "#fb923c", end: "#ea580c" }, 
  { start: "#a3e635", end: "#4d7c0f" }, 
];

const MONTHS = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 5 + i);

function fmt(v: number) {
  return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Sub-components ────────────────────────────────────────────────────────
const StatCard = ({ title, value, description, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.20)] border border-gray-100 flex flex-col gap-4 group hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-gray-700 font-public-sans font-semibold text-sm leading-[1.57143] mb-1.5">{title}</p>
        <h3 className="text-3xl font-barlow font-bold text-gray-900">{fmt(value)}</h3>
        {description && (
          <p className="text-[11px] text-gray-400 font-medium mt-1 leading-tight">{description}</p>
        )}
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden min-w-[140px]">
        <div className="bg-gray-300 px-3 py-1.5 text-center">
            <span className="text-xs font-semibold text-gray-500 capitalize">{label}</span>
        </div>
        <div className="p-3 space-y-2">
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[11px] font-semibold text-gray-600 capitalize">{entry.name}:</span>
                    </div>
                    <span className="text-xs font-medium text-gray-800 tracking-tight">{fmt(entry.value)}</span>
                </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

const RadialTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1e293b] px-3 py-2 rounded-xl shadow-xl border border-gray-800 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight mb-1">{data.name}</p>
        <p className="text-xs font-black text-white">{fmt(data.amount)}</p>
      </div>
    );
  }
  return null;
};

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function BankingPage() {
  const router = useRouter();
  const { color: themeColor } = useSelector((state: any) => state.theme);
  const { currentUser } = useSelector((state: any) => state.user);
  const [data, setData] = useState<BankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statView, setStatView] = useState<"monthly" | "yearly">("monthly");
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ year: String(selectedYear) });
      if (selectedMonth > 0) params.set("month", String(selectedMonth));
      const res = await fetch(`/api/banking?${params}`);
      const json = await res.json();
      if (res.ok && json.success) setData(json.data);
      else toast.error(json.message || "Failed to load banking data");
    } catch {
      toast.error("An error occurred while fetching banking data");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totals = data?.totals ?? { totalIncome: 0, totalExpense: 0, balance: 0 };
  const incomePct = totals.totalIncome > 0 ? "+43%" : null;

  const radialData = useMemo(() => {
    const apiData = data?.expenseCategories ?? [];
    const allCategories = Object.keys(CATEGORY_META);
    
    const merged = allCategories.map(catName => {
      const match = apiData.find(ad => ad.name.toLowerCase() === catName.toLowerCase());
      return {
        name: catName.charAt(0).toUpperCase() + catName.slice(1),
        amount: match ? match.amount : 0
      };
    });

    return merged.map((cat, i) => ({
      ...cat,
      fill: `url(#gradient-${i % CHART_COLORS.length})`
    })).sort((a, b) => b.amount - a.amount);
  }, [data?.expenseCategories]);

  const filteredTx = (data?.transactions ?? []).filter(tx =>
    typeFilter === "all" ? true : tx.type === typeFilter
  );

  const columns: ColumnDef<Transaction>[] = [
    {
      key: "title",
      label: "Description",
      type: "custom",
      render: (row) => {
        const isIncome = row.type === "income";
        const meta = isIncome ? INCOME_META : (CATEGORY_META[row.category.toLowerCase()] ?? EXPENSE_FALLBACK);
        return (
          <div className="flex items-center gap-4">
             <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative order-1 shadow-xs"
                style={{ backgroundColor: meta.bg, color: meta.color }}
             >
                <Icon icon={meta.icon} className="text-2xl" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center bg-gray-100 shadow-sm">
                   <Icon 
                      icon={isIncome ? "solar:round-alt-arrow-down-bold" : "solar:round-alt-arrow-up-bold"} 
                      className={`text-[8px] ${isIncome ? "text-emerald-500" : "text-rose-500"}`}
                   />
                </div>
             </div>
             <div className="flex flex-col gap-0.5 order-2">
                <span className="text-sm font-semibold text-gray-700 transition-colors capitalize">{row.title}</span>
                <span className="text-[11px] font-semibold text-gray-400 transition-colors capitalize">{isIncome ? "Payment" : "Expense"}</span>
             </div>
          </div>
        )
      }
    },
    {
      key: "status",
      label: "Status",
      type: "status",
      getStatus: (row) => row.type === "income" ? "income" : "expense"
    },
     {
      key: "date",
      label: "Date",
      type: "date",
      className:"font-barlow",
      getDate: (row) => row.date,
    },
    {
      key: "amount",
      label: "Amount",
      type: "custom",
      render: (row) => (
        <span className="text-sm font-medium font-barlow text-gray-900">{fmt(row.amount)}</span>
      )
    }
  ];

  const transactionTabs: TabDef[] = [
    { label: "All", value: "all", count: data?.transactions.length, color: "default" },
    { label: "Income", value: "income", count: data?.transactions.filter(t => t.type === "income").length, color: "success" },
    { label: "Expense", value: "expense", count: data?.transactions.filter(t => t.type === "expense").length, color: "error" },
  ];

  const handleDownloadReport = async () => {
    if (!data) return;

    const doc = new jsPDF();
    const libraryName = currentUser?.libraryName || currentUser?.name || "My Library";
    const dateStr = new Date().toLocaleString("en-IN", { 
      day: "2-digit", month: "short", year: "numeric", 
      hour: "2-digit", minute: "2-digit" 
    });

    const fmtPDF = (v: number) => "Rs. " + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

    // Logo Handling
    let yAnchor = 20;
    if (currentUser?.profileImage) {
        try {
            const img = new Image();
            img.src = currentUser.profileImage;
            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve; // Continue anyway if fails
            });
            if (img.complete && img.naturalWidth > 0) {
               doc.addImage(img, 'PNG', 14, 15, 12, 12);
               yAnchor = 35;
            }
        } catch (e) { console.error(e); }
    }

    // Header Left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text(libraryName, 14, (currentUser?.profileImage ? 33 : 22));
    
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text("Banking & Financial Report", 14, (currentUser?.profileImage ? 40 : 28));

    // Header Right
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${dateStr}`, doc.internal.pageSize.width - 14, 22, { align: "right" });
    doc.text(`Period: ${selectedYear} ${selectedMonth > 0 ? MONTHS[selectedMonth] : "(Yearly)"}`, doc.internal.pageSize.width - 14, 27, { align: "right" });

    // Summary Table
    autoTable(doc, {
      startY: (currentUser?.profileImage ? 50 : 38),
      head: [["Summary Category", "Total Amount"]],
      body: [
        ["Total Balance", fmtPDF(totals.balance)],
        ["Total Income", fmtPDF(totals.totalIncome)],
        ["Total Expenses", fmtPDF(totals.totalExpense)],
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59], textColor: 255, fontSize: 11, fontStyle: "bold" },
      bodyStyles: { fontSize: 10, fontStyle: "bold" },
      columnStyles: { 1: { halign: "right" } },
    });

    // Income Table
    const incomeData = data.transactions
      .filter(t => t.type === "income")
      .map(t => [fmtDate(t.date), t.title, fmtPDF(t.amount)]);

    if (incomeData.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105); // Emerald 600
      doc.text("Income Details", 14, (doc as any).lastAutoTable.finalY + 12);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 16,
        head: [["Date", "Source Description", "Credit Amount"]],
        body: incomeData,
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 2: { halign: "right" } },
      });
    }

    // Expense Table
    const expenseData = data.transactions
      .filter(t => t.type === "expense")
      .map(t => [fmtDate(t.date), t.title, t.category, fmtPDF(t.amount)]);

    if (expenseData.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(225, 29, 72); // Rose 600
      doc.text("Expense Details", 14, (doc as any).lastAutoTable.finalY + 12);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 16,
        head: [["Date", "Expense Description", "Category", "Debit Amount"]],
        body: expenseData,
        theme: "grid",
        headStyles: { fillColor: [244, 63, 94], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 3: { halign: "right" } },
      });
    }

    doc.save(`Banking_Report_${libraryName.replace(/\s+/g, '_')}_${dateStr.split(',')[0]}.pdf`);
    toast.success("Financial report generated successfully");
  };

  return (
    <div className="flex flex-col h-full overflow-auto font-public-sans pb-10">
      <PageHeader
        title="Banking"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Banking" }]}
        actionNode={
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 font-medium h-9 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 font-medium h-9 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <Button
              variant="outline"
              size="sm"
              icon="solar:download-bold"
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </div>
        }
      />

      <div className="border-b border-gray-100 mb-8" />

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-400 font-medium tracking-tight">Loading transactions...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard title="Total Balance" value={totals.balance} description="Available funds across all accounts" icon="solar:wallet-bold-duotone" color="#6366f1" />
              <StatCard title="Total Income" value={totals.totalIncome} description="Total revenue from memberships & fees" icon="solar:graph-up-bold" color="#00a76f" />
              <StatCard title="Total Expenses" value={totals.totalExpense} description="Total maintenance & operational costs" icon="solar:graph-down-bold" color="#f43f5e" />
            </div>
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="bg-white col-span-2 border border-gray-100 rounded-3xl p-8 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
               <div className="flex flex-col gap-0.5 mb-8 text-center md:text-left">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Expense Categories</h2>
                  <p className="text-xs font-medium text-gray-400">Monthly breakdown by purpose</p>
               </div>
               <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 order-1 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={10} data={radialData} startAngle={90} endAngle={-270}>
                         <defs>
                            {CHART_COLORS.map((color, i) => (
                              <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={color.start} stopOpacity={1} />
                                <stop offset="100%" stopColor={color.end} stopOpacity={1} />
                              </linearGradient>
                            ))}
                         </defs>
                        <Tooltip content={<RadialTooltip />} cursor={{ fill: 'transparent' }} />
                        <RadialBar background dataKey="amount" cornerRadius={10} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Spent</p>
                       <p className="text-2xl font-black text-gray-900 font-barlow">{fmt(totals.totalExpense)}</p>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 order-2 flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                     {radialData.map((cat, i) => {
                       const meta = CATEGORY_META[cat.name.toLowerCase()] ?? EXPENSE_FALLBACK;
                       const gradient = CHART_COLORS[i % CHART_COLORS.length];
                       return (
                         <div key={cat.name} className="flex items-center gap-4 group py-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-xs border border-white" style={{ background: `linear-gradient(135deg, ${gradient.start}15 0%, ${gradient.end}25 100%)`, color: gradient.start }}>
                               <Icon icon={meta.icon} className="text-lg" />
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                               <div className="flex items-center justify-between">
                                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{cat.name}</p>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${cat.amount > 0 ? "text-emerald-600 bg-emerald-50" : "text-gray-400 bg-gray-50"}`}>
                                    {totals.totalExpense > 0 ? ((cat.amount / totals.totalExpense) * 100).toFixed(1) : "0.0"}%
                                  </span>
                               </div>
                               <p className="text-[15px] font-black text-gray-900 font-barlow tracking-tight">
                                  {fmt(cat.amount)}
                               </p>
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>
            </div>
          </div> */}

          <div className="bg-white border border-gray-100 rounded-3xl p-8 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Balance Statistics</h2>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full transition-transform hover:scale-105 cursor-default">
                          (+43%) than last year
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-400">Statistics on balance over time</p>
                   </div>
                   <div className="flex items-center gap-1 border border-gray-100 rounded-xl p-1 bg-gray-50/50">
                      {(["monthly", "yearly"] as const).map(v => (
                        <button key={v} onClick={() => setStatView(v)} className={`px-3 py-1 text-sm font-bold rounded-md transition-all capitalize ${statView === v ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                </div>

                <div className="flex gap-10 mt-6 mb-8">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeColor }} />
                        Total Income
                      </div>
                      <p className="text-xl font-medium text-gray-900">{totals.totalIncome > 1000 ? `${(totals.totalIncome/1000).toFixed(2)}k` : totals.totalIncome}</p>
                   </div>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        Total Expenses
                      </div>
                      <p className="text-xl font-medium text-gray-900">{totals.totalExpense > 1000 ? `${(totals.totalExpense/1000).toFixed(2)}k` : totals.totalExpense}</p>
                   </div>
                </div>

                <ResponsiveContainer width="100%" className="-ml-6" height={250}>
                   <AreaChart data={data?.monthlyStats}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={themeColor} stopOpacity={0.1}/><stop offset="95%" stopColor={themeColor} stopOpacity={0}/></linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" name="Total income" dataKey="income" stroke={themeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" name="Total expenses" dataKey="expense" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                   </AreaChart>
                </ResponsiveContainer>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-gray-900">Recent Transitions</h2>
             </div>

             <DataTable
                data={filteredTx}
                columns={columns}
                loading={loading}
                rowKey={(row) => row.id}
                hideSearch={true}
                tabs={transactionTabs}
                activeTab={typeFilter}
                onTabChange={(val) => setTypeFilter(val)}
                hiddenActions={['edit', 'delete']}
                onView={(row) => {
                   if (row.type === "income") {
                      router.push(`/payments/${row.id}`);
                   } else {
                      router.push(`/expenses/view/${row.id}`);
                   }
                }}
             />
          </div>
        </div>
      )}
    </div>
  );
}
