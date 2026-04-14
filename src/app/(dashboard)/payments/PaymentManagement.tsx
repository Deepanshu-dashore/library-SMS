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
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";

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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 divide-dashed">
            
            {/* Total */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <div className="w-14 h-14 rounded-full border-2 border-cyan-100 flex items-center justify-center bg-cyan-50/30 text-cyan-600 transition-transform group-hover:scale-110">
                <Receipt size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 leading-none">Total</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">{stats?.count || 0} Payments</p>
                <p className="text-lg font-black text-gray-900 mt-1 font-barlow">₹{stats?.total?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Cash */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-100 flex items-center justify-center bg-emerald-50/30 text-emerald-600 transition-transform group-hover:scale-110">
                <Wallet size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 leading-none">Cash</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  {stats?.cash?.count || 0} Payments
                </p>
                <p className="text-lg font-black text-gray-900 mt-1 font-barlow">
                  ₹{stats?.cash?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* UPI */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <div className="w-14 h-14 rounded-full border-2 border-indigo-100 flex items-center justify-center bg-indigo-50/30 text-indigo-600 transition-transform group-hover:scale-110">
                <ArrowUpRight size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 leading-none">UPI</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  {stats?.upi?.count || 0} Payments
                </p>
                <p className="text-lg font-black text-gray-900 mt-1 font-barlow">
                  ₹{stats?.upi?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <div className="w-14 h-14 rounded-full border-2 border-amber-100 flex items-center justify-center bg-amber-50/30 text-amber-600 transition-transform group-hover:scale-110">
                <CreditCard size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 leading-none">Card</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  {stats?.card?.count || 0} Payments
                </p>
                <p className="text-lg font-black text-gray-900 mt-1 font-barlow">
                  ₹{stats?.card?.amount?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Last Entry */}
            <div className="flex-1 w-full p-6 flex items-center gap-4 group hover:bg-gray-50/50 transition-colors">
              <div className="w-14 h-14 rounded-full border-2 border-rose-100 flex items-center justify-center bg-rose-50/30 text-rose-600 transition-transform group-hover:scale-110">
                <Calendar size={24} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 leading-none">Last Entry</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">Payment Date</p>
                <p className="text-lg font-black text-gray-900 mt-1 font-barlow">
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
