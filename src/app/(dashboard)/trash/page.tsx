"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef, ActionDef } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import { TABLE_IDS } from "@/constants/tableIds";
import { useTableState } from "@/hooks/useTableState";
import { useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";

export default function TrashPage() {
  const [data, setData] = useState<any[]>([]);
  const { mode } = useSelector((state: any) => state.theme);
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get("filter");

  const {
    hydrated,
    activeFilter: activeTab,
    setActiveFilter: setActiveTab,
  } = useTableState(TABLE_IDS.TRASH, { defaultActiveFilter: "members" });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [stats, setStats] = useState({ members: 0, seats: 0 });

  // Sync activeTab with filter query parameter if present
  useEffect(() => {
    if (filterParam && (filterParam === "members" || filterParam === "seats")) {
      setActiveTab(filterParam);
    }
  }, [filterParam, setActiveTab]);

  const fetchTrash = async (tab = activeTab) => {
    setLoading(true);
    try {
      const [userRes, seatRes] = await Promise.all([
        fetch("/api/user/trash"),
        fetch("/api/seat/trash"),
      ]);
      const userResult = await userRes.json();
      const seatResult = await seatRes.json();

      const users = userResult.success ? userResult.data.users : [];
      const seats = seatResult.success ? seatResult.data : [];

      setStats({
        members: userResult.success ? (userResult.data?.total || users.length) : 0,
        seats: seatResult.success ? seats.length : 0,
      });

      if (tab === "members") {
        setData(users);
      } else {
        setData(seats);
      }
    } catch (error) {
      toast.error("Error fetching trash items");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    fetchTrash(activeTab);
  }, [hydrated, activeTab]);

  const handleRestore = async (item: any) => {
    const loadingToast = toast.loading("Restoring item...");
    try {
      const endpoint = activeTab === "members"
        ? `/api/user/restore/${item._id}`
        : `/api/seat/restore/${item._id}`;
      const res = await fetch(endpoint, { method: "POST" });
      const result = await res.json();

      if (result.success) {
        toast.success(
          activeTab === "members" ? "Member restored successfully" : "Seat restored successfully", 
          { id: loadingToast }
        );
        fetchTrash();
      } else {
        toast.error(result.message || "Failed to restore", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred during restoration", { id: loadingToast });
    }
  };

  const handleDelete = async (item: any) => {
    const entityName = activeTab === "members" ? "member" : "seat";
    if (!confirm(`Are you sure you want to PERMANENTLY delete this ${entityName}? This action cannot be undone.`)) return;

    const loadingToast = toast.loading("Deleting permanently...");
    try {
      const endpoint = activeTab === "members"
        ? `/api/user/deep-delete/${item._id}`
        : `/api/seat/${item._id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success(
          activeTab === "members" ? "Member permanently deleted" : "Seat permanently deleted", 
          { id: loadingToast }
        );
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
      label: "Seat Number",
      type: "text",
      sortable: true
    },
    {
      key: "price",
      label: "Price",
      type: "text",
      render: (row) => `₹${row.price}`,
      sortable: true
    },
    {
      key: "type",
      label: "Type",
      type: "text",
      render: (row) => row.type ? row.type.toUpperCase() : "-",
      sortable: true
    },
    {
      key: "floor",
      label: "Floor",
      type: "text",
      render: (row) => row.floor || "-",
      sortable: true
    },
    { 
        key: "updatedAt", 
        label: "Deleted At", 
        type: "date",
        getDate: (row) => row.updatedAt,
        sortable: true 
    },
  ];

  const columns = activeTab === "members" ? memberColumns : seatColumns;

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

  const currentCount = activeTab === "members" ? stats.members : stats.seats;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl">
        <PageHeader 
          title="Recycle Bin" 
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Recycle Bin" }]}
          actionNode={
            <span className={`text-xs font-bold uppercase tracking-widest ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {currentCount} item{currentCount !== 1 ? 's' : ''} in bin
            </span>
          }
        />

        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          rowKey={(row) => row._id}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(val) => {
            setActiveTab(val);
            router.push(`/trash?filter=${val}`);
          }}
          hiddenActions={["view", "edit"]}
          onDelete={handleDelete}
          searchPlaceholder={activeTab === "members" ? "Search by member name..." : "Search by seat number or floor..."}
          additionalActions={additionalActions}
        />
      </div>
    </div>
  );
}
