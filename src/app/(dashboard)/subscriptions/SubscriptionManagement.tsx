"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  RefreshCcw, 
  ArrowRightLeft, 
  XCircle, 
  Ticket, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef, ActionDef } from "@/components/shared/DataTable";

interface Subscription {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  seatId: {
    _id: string;
    seatNumber: string;
  };
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  createdAt: string;
}

interface Stats {
  totalActive: number;
  totalExpired: number;
  totalCancelled: number;
  totalSub: number;
}

export default function SubscriptionManagement() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalActive: 0,
    totalExpired: 0,
    totalCancelled: 0,
    totalSub: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscription`);
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.data.subscriptions);
        setStats({
          totalActive: data.data.totalActive,
          totalExpired: data.data.totalExpired,
          totalCancelled: data.data.totalCancelled,
          totalSub: data.data.totalSub
        });
      } else {
        toast.error(data.message || "Failed to fetch subscriptions");
      }
    } catch (error) {
      toast.error("An error occurred while fetching subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`Are you sure you want to cancel the subscription for ${sub.userId.name}?`)) return;

    const loadingToast = toast.loading("Cancelling subscription...");
    try {
      const res = await fetch(`/api/subscription/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: sub._id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Subscription cancelled successfully", { id: loadingToast });
        fetchSubscriptions();
      } else {
        toast.error(data.message || "Failed to cancel subscription", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  const columns: ColumnDef<Subscription>[] = [
    {
      key: "userId",
      label: "Member",
      type: "user",
      getTitle: (row) => row.userId?.name || "Unknown",
      getSubtitle: (row) => row.userId?.email || "No email",
      getAvatar: (row) => row.userId?.name?.charAt(0) || "?",
      sortable: true
    },
    {
      key: "seatId",
      label: "Seat",
      type: "custom",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
            {row.seatId?.seatNumber || "-"}
          </div>
          <span className="font-semibold text-gray-700">Seat {row.seatId?.seatNumber}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: "startDate",
      label: "Period",
      type: "custom",
      render: (row) => {
        const start = new Date(row.startDate);
        const end = new Date(row.endDate);
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <span className="font-semibold text-gray-900">{start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
               <ArrowRightLeft className="w-3 h-3 text-gray-400" />
               <span className="font-semibold text-gray-900">{end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
               {Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))} Days
            </span>
          </div>
        )
      }
    },
    {
       key: "status",
       label: "Status",
       type: "status",
       getStatus: (row) => {
          const today = new Date();
          const end = new Date(row.endDate);
          if (row.status === "cancelled") return "Cancelled";
          if (end < today) return "Expired";
          return "Active";
       },
       sortable: true
    }
  ];

  const additionalActions: ActionDef<Subscription>[] = [
    {
      label: "Renew",
      icon: RefreshCcw,
      disabled: (row) => row.status === "cancelled",
      onClick: (row) => router.push(`/subscriptions/renew/${row._id}`)
    },
    {
      label: "Transfer",
      icon: ArrowRightLeft,
      disabled: (row) => row.status !== "active",
      onClick: (row) => router.push(`/subscriptions/transfer/${row._id}`)
    },
    {
      label: "Cancel",
      icon: XCircle,
      isDanger: true,
      disabled: (row) => row.status !== "active",
      onClick: handleCancel
    }
  ];

  const tabs: TabDef[] = [
    { label: "All", value: "All", count: stats.totalSub },
    { label: "Active", value: "active", count: stats.totalActive, color: "success" },
    { label: "Expired", value: "expired", count: stats.totalExpired, color: "warning" },
    { label: "Cancelled", value: "cancelled", count: stats.totalCancelled, color: "error" },
  ];

  const filteredData = subscriptions.filter(sub => {
    if (statusFilter === "All") return true;
    
    const today = new Date();
    const end = new Date(sub.endDate);
    
    if (statusFilter === "active") return sub.status === "active" && end >= today;
    if (statusFilter === "expired") return (sub.status === "active" && end < today);
    if (statusFilter === "cancelled") return sub.status === "cancelled";
    
    return true;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-[1240px] mx-auto p-4 md:p-8">
        
        <PageHeader 
          title="Subscription Management"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions" }
          ]}
          actionNode={
            <button
               onClick={() => router.push("/subscriptions/add")}
               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
               <Plus className="text-xl" />
               Add Subscription
            </button>
          }
        />

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Subscriptions", count: stats.totalSub, icon: Ticket, color: "bg-indigo-600" },
            { label: "Active", count: stats.totalActive, icon: CheckCircle, color: "bg-green-600" },
            { label: "Expired", count: stats.totalExpired, icon: Clock, color: "bg-amber-600" },
            { label: "Cancelled", count: stats.totalCancelled, icon: XCircle, color: "bg-red-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-indigo-100 transition-all">
               <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tight">{stat.count}</h4>
               </div>
               <div className={`w-14 h-14 ${stat.color} text-white rounded-3xl flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-0 transition-transform`}>
                  <stat.icon size={28} />
               </div>
            </div>
          ))}
        </div>

        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          rowKey={(row) => row._id}
          searchPlaceholder="Search by member name or seat..."
          tabs={tabs}
          activeTab={statusFilter}
          onTabChange={(val) => setStatusFilter(val)}
          onView={(row) => router.push(`/subscriptions/${row._id}`)}
          additionalActions={additionalActions}
          hiddenActions={['edit', 'delete']}
        />
      </div>
    </div>
  );
}
