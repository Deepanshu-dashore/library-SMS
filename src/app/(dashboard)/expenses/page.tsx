"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ExpenseData {
  _id: string;
  title: string;
  amount: number;
  category: "electricity" | "rent" | "water" | "maintenance" | "other";
  date: string;
  note?: string;
  receipt?: string;
}

export default function ManageExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/expence");
      const data = await res.json();
      if (res.ok && data.success) {
        // The service returns { data: expenseArray, total: number }
        // So ApiResponse wraps it as { success, message, data: { data, total } }
        setExpenses(data.data?.data || []);
        setTotalAmount(data.data?.total || 0);
      } else {
        toast.error(data.message || "Failed to fetch expenses");
      }
    } catch (error) {
      toast.error("An error occurred while fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (row: ExpenseData) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`/api/expence/${row._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Expense deleted successfully");
        fetchExpenses();
      } else {
        toast.error(data.message || "Failed to delete expense");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the expense");
    }
  };

  const handleEdit = (row: ExpenseData) => {
    router.push(`/expenses/edit/${row._id}`);
  };

  const handleView = (row: ExpenseData) => {
    router.push(`/expenses/view/${row._id}`);
  };

  const columns: ColumnDef<ExpenseData>[] = [
    {
      key: "title",
      label: "Expense Title",
      type: "text",
      // sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      type: "text",
      // sortable: true,
      render: (row) => (
        <span className="font-bold text-gray-900">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      type: "status",
      // sortable: true,
      getStatus: (row) => row.category,
    },
    {
      key: "date",
      label: "Date",
      type: "date",
      // sortable: true,
      getDate: (row) => row.date,
    },
    {
      key: "note",
      label: "Note",
      type: "text",
      render: (row) => (
        <span className="text-gray-500 max-w-[200px] truncate block">
          {row.note || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-auto font-sans">
      <PageHeader
        title="Manage Expenses"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Expenses" },
        ]}
        actionNode={
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Expenses</span>
                <span className="text-xl font-black text-gray-900 tracking-tight">₹{totalAmount.toLocaleString()}</span>
             </div>
            <Link
              href="/expenses/add"
              className="flex items-center gap-2 bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4338ca] transition-all shadow-md shadow-indigo-500/10 active:scale-95"
            >
              <PlusIcon className="w-5 h-5 stroke-[2.5px]" />
              Add New Expense
            </Link>
          </div>
        }
      />

      <DataTable
        data={expenses}
        columns={columns}
        loading={loading}
        rowKey={(row) => row._id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        hiddenActions={[]}
        searchPlaceholder="Search expenses..."
      />
    </div>
  );
}
