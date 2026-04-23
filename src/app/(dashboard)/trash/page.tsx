"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef, ActionDef } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import { Icon } from "@iconify/react";

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState("members");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [stats, setStats] = useState({ members: 0, seats: 0 });

  const fetchTrash = async (tab = activeTab) => {
    setLoading(true);
    try {
      // Fetch both for counts
      const [userRes, seatRes] = await Promise.all([
        fetch("/api/user/trash"),
        fetch("/api/seat/trash")
      ]);
      
      const userResult = await userRes.json();
      const seatResult = await seatRes.json();
      
      const users = userResult.success ? userResult.data.users : [];
      const seats = seatResult.success ? seatResult.data : [];
      
      setStats({
        members: userResult.success ? (userResult.data?.total || 0) : 0,
        seats: seats.length
      });

      setData(tab === "members" ? users : seats);
    } catch (error) {
      toast.error("Error fetching trash items");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchTrash(activeTab);
  }, [activeTab]);

  const handleRestore = async (item: any) => {
    const loadingToast = toast.loading("Restoring item...");
    try {
      const endpoint = activeTab === "members" 
        ? `/api/user/restore/${item._id}` 
        : `/api/seat/restore/${item._id}`;
      
      const res = await fetch(endpoint, { method: "POST" });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Item restored successfully", { id: loadingToast });
        fetchTrash();
      } else {
        toast.error(result.message || "Failed to restore", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred during restoration", { id: loadingToast });
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete this ${activeTab === "members" ? "member" : "seat"}? This action cannot be undone.`)) return;
    
    const loadingToast = toast.loading("Deleting permanently...");
    try {
      const endpoint = activeTab === "members" 
        ? `/api/user/${item._id}` 
        : `/api/seat/${item._id}`;
      
      const res = await fetch(endpoint, { method: "DELETE" });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Item permanently deleted", { id: loadingToast });
        fetchTrash();
      } else {
        toast.error(result.message || "Failed to delete", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred during deletion", { id: loadingToast });
    }
  };

  const memberColumns: ColumnDef<any>[] = [
    {
      key: "name",
      label: "Member",
      type: "user",
      getTitle: (row) => row.name || "Unknown",
      getSubtitle: (row) => row.email || "No email",
      getAvatar: (row) => row.photo || (row.name ? row.name.charAt(0) : "?"),
      sortable: true
    },
    { key: "number", label: "Contact", type: "text" },
    { 
        key: "updatedAt", 
        label: "Deleted At", 
        type: "date",
        getDate: (row) => row.updatedAt,
        sortable: true 
    },
    {
      key: "status",
      label: "Last Status",
      type: "status",
      getStatus: (row) => row.status,
    }
  ];

  const seatColumns: ColumnDef<any>[] = [
    {
      key: "seatNumber",
      label: "Seat Info",
      type: "custom",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 font-bold font-barlow">
            {row.seatNumber}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">Seat {row.seatNumber}</span>
            <span className="text-xs text-gray-500 font-medium">{row.floor || "General"}</span>
          </div>
        </div>
      ),
      sortable: true
    },
    { key: "type", label: "Type", type: "status", getStatus: (row) => row.type },
    { 
        key: "updatedAt", 
        label: "Deleted At", 
        type: "date",
        getDate: (row) => row.updatedAt,
        sortable: true 
    },
  ];

  const tabs: TabDef[] = [
    { label: "Members", value: "members", count: stats.members, color: "info" },
    { label: "Seats", value: "seats", count: stats.seats, color: "warning" },
  ];

  const additionalActions: ActionDef<any>[] = [
    {
      label: "Restore Item",
      icon: RotateCcw,
      onClick: (item: any) => handleRestore(item),
    }
  ];

  if (isInitialLoad) return <SimpleLoader text="Cleaning up trash" />;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl">
        <PageHeader 
          title="Recycle Bin" 
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Recycle Bin" }]}
        />

        <DataTable 
          data={data}
          columns={activeTab === "members" ? memberColumns : seatColumns}
          loading={loading}
          rowKey={(row) => row._id}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(val) => setActiveTab(val)}
          hiddenActions={["view", "edit"]}
          onDelete={handleDelete}
          searchPlaceholder={`Search by ${activeTab === "members" ? "member name" : "seat number"}...`}
          additionalActions={additionalActions}
        />
      </div>
    </div>
  );
}
