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
import { TABLE_IDS } from "@/constants/tableIds";
import { useTableState } from "@/hooks/useTableState";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const { mode } = useSelector((state: any) => state.theme);
  const queryClient = useQueryClient();

  const {
    hydrated,
    searchTerm,
    statusFilter,
    currentPage,
    rowsPerPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    setRowsPerPage,
    clearFilters,
  } = useTableState(TABLE_IDS.USERS);

  // Debounce the search term to prevent excessive requests
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: usersQueryData, isLoading: loading } = useQuery({
    queryKey: ["users", { search: debouncedSearch, status: statusFilter, page: currentPage, limit: rowsPerPage }],
    queryFn: async () => {
      const searchParam = debouncedSearch ? `search=${debouncedSearch}` : "";
      const statusParam = statusFilter !== "All" ? `status=${statusFilter}` : "";
      const limitParam = `limit=${rowsPerPage}`;
      const pageParam = `page=${currentPage}`;
      const query = [searchParam, statusParam, limitParam, pageParam].filter(Boolean).join("&");
      const { data } = await axios.get(`/api/user${query ? `?${query}` : ""}`);
      if (data.success) {
        return data.data;
      }
      throw new Error(data.message || "Failed to fetch users");
    },
    enabled: hydrated,
  });

  const users = usersQueryData?.users || [];
  const total = usersQueryData?.total || 0;
  const stats = usersQueryData?.stats || { total: 0, active: 0, inactive: 0, unverify: 0, withoutSeat: 0 };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    const loadingToast = toast.loading("Deleting user...");
    try {
      const { data } = await axios.delete(`/api/user/soft-delete/${user._id}`);
      if (data.success) {
        toast.success("User deleted successfully", { id: loadingToast });
        queryClient.invalidateQueries({ queryKey: ["users"] });
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
        queryClient.invalidateQueries({ queryKey: ["users"] });
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
          <span className={clsx("font-semibold text-gray-900", mode === "dark" && "!text-slate-200")}>{row.email}</span>
          <span className={clsx("text-[13px] text-gray-500 font-medium tracking-tight", mode === "dark" && "!text-slate-400")}>{row.number}</span>
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
    <div className={clsx("min-h-screen bg-transparent", mode !== "dark" && "bg-gray-50/50")}>
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
                size="sm"
                variant="outline"
                // className="rounded-2xl px-4 py-1 font-medium text-indigo-600 border-indigo-100 hover:bg-indigo-50"
                className="font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </Button>
              <Button
                onClick={() => router.push("/users/create")}
                variant="primary"
                size="sm"
                className="font-medium"
              >
                <Plus className="h-5 w-5" />
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
          currentPage={currentPage}
          totalCount={total}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
          onRowsPerPageChange={(l) => {
            setRowsPerPage(l);
            setCurrentPage(1);
          }}
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
                onClearAll={clearFilters}
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
