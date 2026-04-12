"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, Users, Square } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState("members");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "members" ? "/api/user/trash" : "/api/seat/trash";
      const res = await fetch(endpoint);
      const result = await res.json();
      if (result.success) {
        setData(activeTab === "members" ? result.data.users : result.data);
      } else {
        toast.error(result.message || "Failed to fetch trash");
      }
    } catch (error) {
      toast.error("Error fetching trash items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
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
    { key: "name", label: "Name", type: "text", sortable: true },
    { key: "email", label: "Email", type: "text" },
    { key: "number", label: "Contact", type: "text" },
    { 
        key: "updatedAt", 
        label: "Deleted At", 
        type: "custom", 
        render: (row) => new Date(row.updatedAt).toLocaleDateString() 
    },
  ];

  const seatColumns: ColumnDef<any>[] = [
    { key: "seatNumber", label: "Seat Number", type: "text", sortable: true },
    { key: "type", label: "Type", type: "status", getStatus: (row) => row.type },
    { key: "floor", label: "Floor", type: "text" },
    { 
        key: "updatedAt", 
        label: "Deleted At", 
        type: "custom", 
        render: (row) => new Date(row.updatedAt).toLocaleDateString() 
    },
  ];

  const tabs = [
    { label: "Members", value: "members", icon: <Users size={16} /> },
    { label: "Seats", value: "seats", icon: <Square size={16} /> },
  ];

  const additionalActions = [
    {
      label: "Restore",
      icon: RotateCcw,
      onClick: (item: any) => handleRestore(item),
    }
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-[1240px] mx-auto p-4 md:p-8">
        <PageHeader 
          title="Recycle Bin" 
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Trash" }]}
        />

        <div className="mb-6 flex gap-2">
            {tabs.map(tab => (
                <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? "primary" : "secondary"}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all shadow-sm ${
                        activeTab === tab.value 
                        ? "bg-gray-900 text-white" 
                        : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100"
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                </Button>
            ))}
        </div>

        <DataTable 
          data={data}
          columns={activeTab === "members" ? memberColumns : seatColumns}
          loading={loading}
          rowKey={(row) => row._id}
          hiddenActions={["view", "edit"]}
          onDelete={handleDelete}
          additionalActions={additionalActions}
        />
      </div>
    </div>
  );
}
