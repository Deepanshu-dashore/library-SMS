"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Link as LinkIcon, Users, UserCheck, UserX, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  category: string;
  status: string;
  course?: string;
  photo?: string;
  signature?: string;
  createdAt: string;
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const searchParam = searchTerm ? `search=${searchTerm}` : "";
      const statusParam = statusFilter !== "All" ? `status=${statusFilter}` : "";
      const query = [searchParam, statusParam].filter(Boolean).join("&");
      const res = await fetch(`/api/user${query ? `?${query}` : ""}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    const loadingToast = toast.loading("Deleting user...");
    try {
      const res = await fetch(`/api/user/${user._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("User deleted successfully", { id: loadingToast });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete user", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Member",
      type: "user",
      getTitle: (row) => row.name,
      getSubtitle: (row) => row.course || "General Member",
      getAvatar: (row) => row.name.charAt(0),
      sortable: true
    },
    {
      key: "email",
      label: "Contact",
      type: "custom",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{row.email}</span>
          <span className="text-[13px] text-gray-500 font-medium tracking-tight">{row.number}</span>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      type: "text",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      type: "status",
      getStatus: (row) => row.status,
      sortable: true
    }
  ];

  const tabs: TabDef[] = [
    { label: "All Members", value: "All", count: users.length },
    { label: "Active", value: "Active", count: users.filter(u => u.status === "Active").length, color: "success" },
    { label: "Inactive", value: "Inactive", count: users.filter(u => u.status === "Inactive").length, color: "error" },
    { label: "Unverify", value: "Unverify", count: users.filter(u => u.status === "Unverify").length, color: "warning" },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-[1240px] mx-auto p-4 md:p-8">
        
        <PageHeader 
          title="User Management"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "User Management" }
          ]}
          actionNode={
            <div className="flex gap-4">
               <button
                  onClick={() => {
                    const url = `${window.location.origin}/register`;
                    navigator.clipboard.writeText(url);
                    toast.success("Registration link copied!");
                  }}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
               >
                  <LinkIcon className="w-4 h-4" />
                  Copy Link
               </button>
               <button
                  onClick={() => router.push("/users/create")}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 active:scale-95"
               >
                  <Plus className="text-xl" />
                  New Member
               </button>
            </div>
          }
        />

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Members", count: users.length, icon: Users, color: "bg-indigo-600" },
            { label: "Active", count: users.filter((u) => u.status === "Active").length, icon: UserCheck, color: "bg-green-600" },
            { label: "Inactive", count: users.filter((u) => u.status === "Inactive").length, icon: UserX, color: "bg-red-600" },
            { label: "Requires Verification", count: users.filter((u) => u.status === "Unverify").length, icon: Clock, color: "bg-amber-600" },
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
          data={users}
          columns={columns}
          loading={loading}
          rowKey={(row) => row._id}
          searchPlaceholder="Search by name, email or mobile..."
          onSearch={(val) => setSearchTerm(val)}
          tabs={tabs}
          activeTab={statusFilter}
          onTabChange={(val) => setStatusFilter(val)}
          hiddenActions={[]}
          onView={(user) => router.push(`/users/${user._id}`)}
          onEdit={(user) => router.push(`/users/${user._id}/edit`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
