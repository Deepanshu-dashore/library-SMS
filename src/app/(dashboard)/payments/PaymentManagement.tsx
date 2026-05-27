"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { 
  CreditCard, 
  Receipt, 
  Wallet, 
  ArrowUpRight,
  Filter,
  Users,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";
import * as XLSX from "xlsx";
import { Button } from "@/components/shared/Button";
import { TABLE_IDS } from "@/constants/tableIds";
import { useTableState } from "@/hooks/useTableState";
import { useSelector } from "react-redux";
import clsx from "clsx";

const CircularProgress = ({ value, icon, color1, color2, id, mode }: { value: number; icon: string; color1: string; color2: string; id: string; mode?: string }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {/* Background Circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="3.5"
          fill="transparent"
          className={clsx(mode === "dark" ? "text-slate-800" : "text-gray-100")}
        />
        {/* Progress Circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={`url(#${id})`}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={clsx(
            "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border",
            mode === "dark" ? "border-slate-700/40" : "border-white/50"
          )}
          style={{ background: `linear-gradient(135deg, ${color1}15, ${color2}15)` }}
        >
          <Icon icon={icon} className="w-7 h-7" style={{ color: color1 }} />
        </div>
      </div>
    </div>
  );
};

interface Payment {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  amount: number;
  paymentMode: string;
  durationDays: number;
  receiptNumber: string;
  createdAt: string;
}

import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Payment {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  amount: number;
  paymentMode: string;
  durationDays: number;
  receiptNumber: string;
  createdAt: string;
}

export default function PaymentManagement() {
  const router = useRouter();
  const { mode } = useSelector((state: any) => state.theme);
  const queryClient = useQueryClient();

  const {
    hydrated,
    searchTerm,
    activeFilter: activeTab,
    setSearchTerm,
    setActiveFilter: setActiveTab,
  } = useTableState(TABLE_IDS.PAYMENTS);
  const [sharingId, setSharingId] = useState<string | null>(null);

  // Debounce search term to prevent excessive requests
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: paymentQueryData, isLoading: loading } = useQuery({
    queryKey: ["payments", { search: debouncedSearch, mode: activeTab }],
    queryFn: async () => {
      const searchParam = debouncedSearch ? `search=${debouncedSearch}` : "";
      const modeParam = activeTab !== "All" ? `mode=${activeTab}` : "";
      const query = [searchParam, modeParam].filter(Boolean).join("&");
      
      const res = await fetch(`/api/payment${query ? `?${query}` : ""}`);
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      throw new Error(data.message || "Failed to fetch payments");
    },
    enabled: hydrated,
  });

  const payments = paymentQueryData?.payments || [];
  const stats = paymentQueryData?.stats || null;
  
  const handleShareReceipt = async (payment: Payment) => {
    setSharingId(payment._id);
    try {
      const res = await fetch(`/api/payment/${payment._id}/share-link`);
      const result = await res.json();
      
      if (result.success) {
        const url = result.link;
        const capitalizedName = payment.userId.name.replace(/\b\w/g, (l: string) => l.toUpperCase());
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

  const columns: ColumnDef<Payment>[] = [
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
          isLoading={sharingId === row._id}
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

  const handleDownloadExcel = () => {
    if (payments.length === 0) {
      toast.error("No payments to export");
      return;
    }

    const wb = XLSX.utils.book_new();
    const now = new Date();
    const formalDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s/g, "-");
    const formalTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).replace(/[:\s]/g, "-");
    const filename = `Payments_${formalDate}_${formalTime}.xlsx`;

    const rows = [
      ["PAYMENT RECORDS REPORT"],
      [],
      ["Property", "Value"],
      ["Total Revenue", `₹${stats?.total?.toLocaleString() || 0}`],
      ["Total Transactions", stats?.count || 0],
      ["Generated At", now.toLocaleString()],
      [],
      ["Member", "Amount", "Mode", "Receipt No.", "Date"],
      ...payments.map((p: Payment) => [
        p.userId?.name || "Deleted User",
        p.amount,
        p.paymentMode.toUpperCase(),
        p.receiptNumber,
        new Date(p.createdAt).toLocaleDateString("en-IN")
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, filename);
    toast.success("Payments exported successfully");
  };

  const tabs: TabDef[] = [
    { label: "All Payments", value: "All", count: stats?.count || 0, color: "default" },
    { label: "Cash", value: "cash", count: stats?.cash?.count || 0, color: "success" },
    { label: "UPI", value: "upi", count: stats?.upi?.count || 0, color: "info" },
    { label: "Card", value: "card", count: stats?.card?.count || 0, color: "warning" },
  ];

  const filteredData = payments;

  if (loading && payments.length === 0) return <SimpleLoader text="Loading Payments" />;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl">
        
        <PageHeader 
          title="Payment Records"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments" }
          ]}
          actionNode={
            <Button
              variant="outline"
              size="md"
              icon="vscode-icons:file-type-excel"
              onClick={handleDownloadExcel}
              className={clsx(
                "font-bold font-medium border",
                mode === "dark"
                  ? "border-emerald-950/40 bg-transparent text-emerald-400 hover:bg-emerald-950/20 hover:border-emerald-900/60"
                  : "text-emerald-600 border-emerald-100 hover:bg-emerald-50"
              )}
            >
              Export Excel
            </Button>
          }
        />

        {/* Financial Summary */}
        <div className={clsx(
          "rounded-2xl border mb-10 overflow-hidden",
          mode === "dark"
            ? "bg-[#1c252e] border-gray-800/80 shadow-none"
            : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.02)]"
        )}>
          <div className={clsx(
            "flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-dashed",
            mode === "dark" ? "divide-gray-800" : "divide-gray-200/90"
          )}>
            
            {/* Total */}
            <div className={clsx(
              "flex-1 w-full p-6 flex items-center gap-4 group transition-colors",
              mode === "dark" ? "hover:bg-slate-800/10" : "hover:bg-gray-50/50"
            )}>
              <CircularProgress 
                id="grad-total"
                value={100} 
                icon="solar:bill-list-bold-duotone" 
                color1="#06b6d4" 
                color2="#3b82f6"
                mode={mode}
              />
              <div className="flex flex-col">
                <p className={clsx("text-[14.5px] font-medium leading-none", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Total Revenue</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">{stats?.count || 0} Invoices</p>
                <p className={clsx("text-base font-medium mt-1 font-barlow tracking-tight", mode === "dark" ? "text-slate-100" : "text-gray-900")}>₹{stats?.total?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Cash */}
            <div className={clsx(
              "flex-1 w-full p-6 flex items-center gap-4 group transition-colors",
              mode === "dark" ? "hover:bg-slate-800/10" : "hover:bg-gray-50/50"
            )}>
              <CircularProgress 
                id="grad-cash"
                value={stats?.count ? Math.round((stats.cash?.count / stats.count) * 100) : 0} 
                icon="solar:wallet-money-bold-duotone" 
                color1="#10b981" 
                color2="#059669"
                mode={mode}
              />
              <div className="flex flex-col">
                <p className={clsx("text-[14.5px] font-medium leading-none", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Cash Payment</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">
                  {stats?.cash?.count || 0} Invoices
                </p>
                <p className={clsx("text-base font-medium mt-1 font-barlow tracking-tight", mode === "dark" ? "text-slate-100" : "text-gray-900")}>
                  ₹{stats?.cash?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* UPI */}
            <div className={clsx(
              "flex-1 w-full p-6 flex items-center gap-4 group transition-colors",
              mode === "dark" ? "hover:bg-slate-800/10" : "hover:bg-gray-50/50"
            )}>
              <CircularProgress 
                id="grad-upi"
                value={stats?.count ? Math.round((stats.upi?.count / stats.count) * 100) : 0} 
                icon="solar:clapperboard-edit-bold-duotone" 
                color1="#6366f1" 
                color2="#4f46e5"
                mode={mode}
              />
              <div className="flex flex-col">
                <p className={clsx("text-[14.5px] font-medium leading-none", mode === "dark" ? "text-slate-100" : "text-gray-900")}>UPI Payment</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">
                  {stats?.upi?.count || 0} Invoices
                </p>
                <p className={clsx("text-base font-medium mt-1 font-barlow tracking-tight", mode === "dark" ? "text-slate-100" : "text-gray-900")}>
                  ₹{stats?.upi?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Card */}
            <div className={clsx(
              "flex-1 w-full p-6 flex items-center gap-4 group transition-colors",
              mode === "dark" ? "hover:bg-slate-800/10" : "hover:bg-gray-50/50"
            )}>
              <CircularProgress 
                id="grad-card"
                value={stats?.count ? Math.round((stats.card?.count / stats.count) * 100) : 0} 
                icon="solar:card-2-bold-duotone" 
                color1="#f59e0b" 
                color2="#d97706"
                mode={mode}
              />
              <div className="flex flex-col">
                <p className={clsx("text-[14.5px] font-medium leading-none", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Card Payment</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">
                  {stats?.card?.count || 0} Invoices
                </p>
                <p className={clsx("text-base font-medium mt-1 font-barlow tracking-tight", mode === "dark" ? "text-slate-100" : "text-gray-900")}>
                  ₹{stats?.card?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Last Entry */}
            <div className={clsx(
              "flex-1 w-full p-6 flex items-center gap-4 group transition-colors",
              mode === "dark" ? "hover:bg-slate-800/10" : "hover:bg-gray-50/50"
            )}>
              <CircularProgress 
                id="grad-last"
                value={100} 
                icon="solar:calendar-date-bold-duotone" 
                color1="#f43f5e" 
                color2="#e11d48"
                mode={mode}
              />
              <div className="flex flex-col">
                <p className={clsx("text-[14.5px] font-medium leading-none", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Last Entry</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">Recent Activity</p>
                <p className={clsx("text-base font-medium mt-1 font-barlow tracking-tight", mode === "dark" ? "text-slate-100" : "text-gray-900")}>
                  {stats?.lastEntry ? new Date(stats.lastEntry).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }) : 'N/A'}
                </p>
              </div>
            </div>

          </div>
        </div>

        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          rowKey={(row) => row._id}
          searchPlaceholder="Search by member, mode or receipt..."
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSearch={(val) => setSearchTerm(val)}
          onView={(row) => router.push(`/payments/${row._id}`)}
          hiddenActions={['edit', 'delete']}
        />
      </div>
    </div>
  );
}
