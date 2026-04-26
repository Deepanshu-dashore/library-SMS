"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Share2, Users, UserCheck, UserX, Clock, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef, TabDef } from "@/components/shared/DataTable";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";
import { FilterChips, FilterBadge } from "@/components/shared/FilterChips";

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  category: string;
  status: string;
  isVerified?: boolean;
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
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, unverify: 0, withoutSeat: 0 });
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const searchParam = searchTerm ? `search=${searchTerm}` : "";
      const statusParam = statusFilter !== "All" ? `status=${statusFilter}` : "";
      const query = [searchParam, statusParam].filter(Boolean).join("&");
      const { data } = await axios.get(`/api/user${query ? `?${query}` : ""}`);
      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
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
    // If it's the initial load (no search/filter), fetch immediately
    if (!searchTerm && statusFilter === "All") {
      fetchUsers();
      return;
    }

    // Debounce subsequent changes
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    const loadingToast = toast.loading("Deleting user...");
    try {
      const { data } = await axios.delete(`/api/user/soft-delete/${user._id}`);
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

  const handleVerify = async (user: User) => {
    const loadingToast = toast.loading(`Verifying ${user.name}...`);
    try {
      const { data } = await axios.patch(`/api/user/verify/${user._id}`);
      if (data.success) {
        toast.success("User verified successfully", { id: loadingToast });
        fetchUsers();
      } else {
        toast.error(data.message || "Verification failed", { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong", { id: loadingToast });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Member",
      type: "user",
      getTitle: (row) => row.name || "Unknown",
      getSubtitle: (row) => row.course || "General Member",
      getAvatar: (row) => row.photo || (row.name ? row.name.charAt(0) : "?"),
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
    }
  ];

  const tabs: TabDef[] = [
    { label: "All Members", value: "All", count: stats.total, color: "default" },
    { label: "Active", value: "Active", count: stats.active, color: "success" },
    { label: "Inactive", value: "Inactive", count: stats.inactive, color: "error" },
    { label: "Unverify", value: "Unverify", count: stats.unverify, color: "warning" },
    { label: "Without Seat", value: "WithoutSeat", count: stats.withoutSeat, color: "default" },
  ];

  if (loading && users.length === 0) return <SimpleLoader text="Loading Members" />;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="">
        
        <PageHeader 
          title="Member Management"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Member Management" }
          ]}
          actionNode={
            <div className="flex gap-4">
               <Button
                  onClick={async () => {
                    const url = `${window.location.origin}/registration`;
                    const shareText = `📚 *Library Member Registration*\n\nWelcome to our Library Management System! Please register your membership using the official portal link below:\n\n🔗 ${url}\n\n*Note:* After registration, please visit the library desk with your physical Aadhar card for biometric verification and seat allocation.`;

                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: 'Library Registration Portal',
                          text: shareText,
                        });
                      } catch (error) {
                        // User cancelled or share failed, fallback to copy
                        navigator.clipboard.writeText(shareText);
                        toast.success("Shareable message copied!");
                      }
                    } else {
                      navigator.clipboard.writeText(shareText);
                      toast.success("Shareable message copied!");
                    }
                  }}
                  variant="outline"
                  className="rounded-2xl px-4 py-1 font-medium text-indigo-600 border-indigo-100 hover:bg-indigo-50"
               >
                  <Share2 className="w-4 h-4" />
                  Share Link
               </Button>
               <Button
                  onClick={() => router.push("/users/create")}
                  variant="primary"
                  className="bg-indigo-600 font-medium hover:bg-indigo-700 rounded-2xl px-4 py-1 shadow-xl shadow-indigo-100"
               >
                  <Plus className="text-xl" />
                  New Member
               </Button>
            </div>
          }
        />

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
          filterChips={
            (searchTerm || statusFilter !== "All") && (
              <FilterChips
                className="pt-0 border-t-0"
                filters={[
                  {
                    id: "search",
                    label: "Search",
                    value: searchTerm,
                    onRemove: () => setSearchTerm(""),
                    active: !!searchTerm,
                  },
                  {
                    id: "status",
                    label: "Status",
                    value: statusFilter,
                    onRemove: () => setStatusFilter("All"),
                    active: statusFilter !== "All",
                  },
                ].filter((f) => f.active) as FilterBadge[]}
                onClearAll={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
              />
            )
          }
          hiddenActions={[]}
          onView={(user) => router.push(`/users/${user._id}`)}
          onEdit={(user) => router.push(`/users/${user._id}/edit`)}
          onDelete={handleDelete}
          additionalActions={[
            {
              label: "Verify Member",
              icon: UserCheck,
              disabled: (user) => !!(user.isVerified || user.status === "Active"),
              onClick: (user) => handleVerify(user)
            }
          ]}
        />
      </div>
    </div>
  );
}
