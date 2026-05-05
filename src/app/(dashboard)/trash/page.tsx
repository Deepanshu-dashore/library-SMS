"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef, ActionDef } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState("members");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [stats, setStats] = useState({ members: 0 });

  const fetchTrash = async (tab = activeTab) => {
    setLoading(true);
    try {
      const userRes = await fetch("/api/user/trash");
      const userResult = await userRes.json();
      const users = userResult.success ? userResult.data.users : [];

      setStats({ members: userResult.success ? (userResult.data?.total || 0) : 0 });
      setData(users);
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
      const res = await fetch(`/api/user/restore/${item._id}`, { method: "POST" });
      const result = await res.json();

      if (result.success) {
        toast.success("Member restored successfully", { id: loadingToast });
        fetchTrash();
      } else {
        toast.error(result.message || "Failed to restore", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred during restoration", { id: loadingToast });
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this member? This action cannot be undone.")) return;

    const loadingToast = toast.loading("Deleting permanently...");
    try {
      const res = await fetch(`/api/user/deep-delete/${item._id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Member permanently deleted", { id: loadingToast });
        fetchTrash();
      } else {
        // Show specific error (e.g. active subscription conflict)
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

  const tabs: TabDef[] = [
    { label: "Members", value: "members", count: stats.members, color: "info" },
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
          columns={memberColumns}
          loading={loading}
          rowKey={(row) => row._id}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(val) => setActiveTab(val)}
          hiddenActions={["view", "edit"]}
          onDelete={handleDelete}
          searchPlaceholder="Search by member name..."
          additionalActions={additionalActions}
        />
      </div>
    </div>
  );
}
