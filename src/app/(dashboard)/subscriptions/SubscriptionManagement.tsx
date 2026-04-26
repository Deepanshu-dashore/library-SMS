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
  AlertCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef, ActionDef } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";
import { StatsCard } from "@/components/shared/StatsCard";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import SeatCalendar from "./SeatCalendar";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/react";

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

  const fetchSubscriptions = async (status?: string) => {
    setLoading(true);
    try {
      const url = status && status !== "All" ? `/api/subscription?status=${status}` : `/api/subscription`;
      const res = await fetch(url);
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
    fetchSubscriptions(statusFilter);
  }, [statusFilter]);

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
        <div className="flex items-center gap-2.5 font-barlow ">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm text-indigo-600 font-bold border border-indigo-100">
            {row.seatId?.seatNumber || "-"}
          </div>
          <span className="font-semibold text-gray-700">Seat {row.seatId?.seatNumber}</span>
        </div>
      ),
      sortable: true
    },
    {
       key: "status",
       label: "Status",
       type: "status",
       getStatus: (row) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const end = new Date(row.endDate);
          if (row.status === "cancelled") return "Cancelled";
          if (end < today) return "Expired";
          return "Active";
       },
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
          <div className="flex flex-col font-barlow">
            <div className="flex items-center gap-2">
               <span className="font-semibold text-gray-700">{start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
               <ArrowRightLeft className="w-3 h-3 text-gray-400" />
               <span className="font-semibold text-gray-700">{end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
               {Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))} Days
            </span>
          </div>
        )
      }
    },{
      key: "daysLeft",
      label: "Days Left",
      type: "custom",
      render: (row) => {
        const today = new Date();
        const end = new Date(row.endDate);
        const diff = end.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (row.status === "cancelled") return <span className="text-gray-400 font-medium">-</span>;
        
        if (days < 0) return (
          <div className="flex items-center font-barlow gap-1.5 text-rose-600 font-medium text-sm">
            Expired
          </div>
        );
        
        if (days <= 5) return (
          <div className="flex items-center font-barlow gap-1.5 text-amber-600 font-medium text-sm">
            {days} Days Left
          </div>
        );
        
        return (
          <div className="flex items-center font-barlow gap-1.5 text-gray-800 font-medium text-sm">
            {days} Days Left
          </div>
        );
      }
    },
  ];

  const handleDownloadExcel = () => {
    if (subscriptions.length === 0) {
      toast.error("No subscriptions to export");
      return;
    }

    const wb = XLSX.utils.book_new();
    const now = new Date();
    const formalDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s/g, "-");
    const formalTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).replace(/[:\s]/g, "-");
    const filename = `Subscriptions_${formalDate}_${formalTime}.xlsx`;

    const rows = [
      ["SUBSCRIPTION MANAGEMENT REPORT"],
      [],
      ["Property", "Value"],
      ["Total Subscriptions", stats.totalSub],
      ["Active Subscriptions", stats.totalActive],
      ["Generated At", now.toLocaleString()],
      [],
      ["Member", "Email", "Seat Number", "Start Date", "End Date", "Status"],
      ...subscriptions.map(s => [
        s.userId?.name || "Unknown",
        s.userId?.email || "No email",
        s.seatId?.seatNumber || "-",
        new Date(s.startDate).toLocaleDateString("en-IN"),
        new Date(s.endDate).toLocaleDateString("en-IN"),
        s.status.toUpperCase()
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Subscriptions");
    XLSX.writeFile(wb, filename);
    toast.success("Subscriptions exported successfully");
  };

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
    { label: "All", value: "All", count: stats.totalSub, color: "default" },
    { label: "Active", value: "active", count: stats.totalActive, color: "success" },
    { label: "Expired", value: "expired", count: stats.totalExpired, color: "warning" },
    { label: "Cancelled", value: "cancelled", count: stats.totalCancelled, color: "error" },
  ];

  const filteredData = subscriptions;

  if (loading && subscriptions.length === 0) return <SimpleLoader text="Loading Subscriptions" />;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl">
        
        <PageHeader 
          title="Subscription Management"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions" }
          ]}
          actionNode={
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="md"
                icon="vscode-icons:file-type-excel"
                onClick={handleDownloadExcel}
                className="font-bold text-emerald-600 font-medium border-emerald-100 hover:bg-emerald-50"
              >
                Export Excel
              </Button>
              <Button
                 onClick={() => router.push("/subscriptions/add")}
                 variant="primary"
                 className="bg-indigo-600 hover:bg-indigo-700 font-medium rounded-2xl px-6 py-3 shadow-xl shadow-indigo-100"
              >
                 <Plus className="text-xl" />
                 Add Subscription
              </Button>
            </div>
          }
        />

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 overflow-visible">
          <StatsCard 
            title="Total Subscriptions" 
            value={stats.totalSub} 
            icon={"solar:layers-bold-duotone"}
            accentColor="#6366f1"
          />
          <StatsCard 
            title="Active Subscriptions" 
            value={stats.totalActive} 
            icon={"solar:bill-check-bold"}
            accentColor="#10b981"
          />
          <StatsCard 
            title="Expired Subscriptions" 
            value={stats.totalExpired} 
            icon={"duo-icons:clock"}
            accentColor="#dc8a00"
          />
          <StatsCard 
            title="Cancelled Subscriptions" 
            value={stats.totalCancelled} 
            icon={"solar:bill-cross-bold-duotone"}
            accentColor="#f43f5e"
          />
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
