"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";

const CircularProgress = ({ value, icon, color1, color2, id }: { value: number; icon: string; color1: string; color2: string; id: string }) => {
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
          className="text-gray-100"
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
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-white/50"
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

export default function PaymentManagement() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const searchParam = searchTerm ? `search=${searchTerm}` : "";
      const modeParam = activeTab !== "All" ? `mode=${activeTab}` : "";
      const query = [searchParam, modeParam].filter(Boolean).join("&");
      
      const res = await fetch(`/api/payment${query ? `?${query}` : ""}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data.payments);
        setStats(data.data.stats);
      } else {
        toast.error(data.message || "Failed to fetch payments");
      }
    } catch (error) {
      toast.error("An error occurred while fetching payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchPayments();
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab, searchTerm]);

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
      type: "status",
      getStatus: (row) => row.paymentMode,
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
    }
  ];

  const tabs: TabDef[] = [
    { label: "All Payments", value: "All", count: stats?.count || 0, color: "default" },
    { label: "Cash", value: "cash", count: stats?.cash?.count || 0, color: "success" },
    { label: "UPI", value: "upi", count: stats?.upi?.count || 0, color: "info" },
    { label: "Card", value: "card", count: stats?.card?.count || 0, color: "warning" },
  ];

  const filteredData = payments;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl">
        
        <PageHeader 
          title="Payment Records"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments" }
          ]}
        />

        {/* Financial Summary */}
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.02)] mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200/90 divide-dashed">
            
            {/* Total */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <CircularProgress 
                id="grad-total"
                value={100} 
                icon="solar:bill-list-bold-duotone" 
                color1="#06b6d4" 
                color2="#3b82f6" 
              />
              <div className="flex flex-col">
                <p className="text-[14.5px] font-medium text-gray-900 leading-none">Total Revenue</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">{stats?.count || 0} Invoices</p>
                <p className="text-base font-medium text-gray-900 mt-1 font-barlow tracking-tight">₹{stats?.total?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Cash */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <CircularProgress 
                id="grad-cash"
                value={stats?.count ? Math.round((stats.cash?.count / stats.count) * 100) : 0} 
                icon="solar:wallet-money-bold-duotone" 
                color1="#10b981" 
                color2="#059669" 
              />
              <div className="flex flex-col">
                <p className="text-[14.5px] font-medium text-gray-900 leading-none">Cash Payment</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">
                  {stats?.cash?.count || 0} Invoices
                </p>
                <p className="text-base font-medium text-gray-900 mt-1 font-barlow tracking-tight">
                  ₹{stats?.cash?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* UPI */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <CircularProgress 
                id="grad-upi"
                value={stats?.count ? Math.round((stats.upi?.count / stats.count) * 100) : 0} 
                icon="solar:clapperboard-edit-bold-duotone" 
                color1="#6366f1" 
                color2="#4f46e5" 
              />
              <div className="flex flex-col">
                <p className="text-[14.5px] font-medium text-gray-900 leading-none">UPI Payment</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">
                  {stats?.upi?.count || 0} Invoices
                </p>
                <p className="text-base font-medium text-gray-900 mt-1 font-barlow tracking-tight">
                  ₹{stats?.upi?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <CircularProgress 
                id="grad-card"
                value={stats?.count ? Math.round((stats.card?.count / stats.count) * 100) : 0} 
                icon="solar:card-2-bold-duotone" 
                color1="#f59e0b" 
                color2="#d97706" 
              />
              <div className="flex flex-col">
                <p className="text-[14.5px] font-medium text-gray-900 leading-none">Card Payment</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">
                  {stats?.card?.count || 0} Invoices
                </p>
                <p className="text-base font-medium text-gray-900 mt-1 font-barlow tracking-tight">
                  ₹{stats?.card?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Last Entry */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <CircularProgress 
                id="grad-last"
                value={100} 
                icon="solar:calendar-date-bold-duotone" 
                color1="#f43f5e" 
                color2="#e11d48" 
              />
              <div className="flex flex-col">
                <p className="text-[14.5px] font-medium text-gray-900 leading-none">Last Entry</p>
                <p className="text-xs font-semibold text-gray-400 mt-1.5">Recent Activity</p>
                <p className="text-base font-medium text-gray-900 mt-1 font-barlow tracking-tight">
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
