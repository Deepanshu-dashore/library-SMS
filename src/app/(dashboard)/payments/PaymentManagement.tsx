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

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment");
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
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
    fetchPayments();
  }, []);

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
        <span className="font-extrabold text-gray-900">₹{row.amount}</span>
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
      type: "text"
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
    { label: "All Payments", value: "All", count: payments.length },
    { label: "Cash", value: "cash", count: payments.filter(p => p.paymentMode === "cash").length },
    { label: "UPI", value: "upi", count: payments.filter(p => p.paymentMode === "upi").length },
    { label: "Card", value: "card", count: payments.filter(p => p.paymentMode === "card").length },
  ];

  const filteredData = activeTab === "All" 
    ? payments 
    : payments.filter(p => p.paymentMode === activeTab);

  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-[1240px] mx-auto p-4 md:p-8">
        
        <PageHeader 
          title="Payment Records"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments" }
          ]}
        />

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
           <div className="bg-indigo-600 p-8 rounded-[40px] shadow-xl shadow-indigo-100 flex items-center justify-between text-white group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                 <p className="text-indigo-100 text-[11px] font-black uppercase tracking-widest mb-1">Total Collections</p>
                 <h4 className="text-4xl font-black tracking-tight">₹{totalRevenue.toLocaleString()}</h4>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center relative z-10">
                 <Wallet size={32} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center justify-between group">
              <div>
                 <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Total Receipts</p>
                 <h4 className="text-4xl font-black text-gray-900 tracking-tight">{payments.length}</h4>
              </div>
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[24px] flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                 <Receipt size={32} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center justify-between group">
              <div>
                 <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Last Payment</p>
                 <h4 className="text-xl font-black text-gray-900 tracking-tight">
                    {payments.length > 0 ? new Date(payments[0].createdAt).toLocaleDateString() : 'N/A'}
                 </h4>
              </div>
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[24px] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                 <Calendar size={32} />
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
          onView={(row) => router.push(`/payments/${row._id}`)}
          hiddenActions={['edit', 'delete']}
        />
      </div>
    </div>
  );
}
