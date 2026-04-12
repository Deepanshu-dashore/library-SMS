"use client";

import React, { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/shared/Button";

interface EditExpenseProps {
  params: Promise<{ id: string }>;
}

export default function EditExpensePage({ params }: EditExpenseProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "other",
    date: "",
    note: "",
  });
  const [receipt, setReceipt] = useState<File | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`/api/expence/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          const expense = data.data;
          setFormData({
            title: expense.title,
            amount: String(expense.amount),
            category: expense.category,
            date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
            note: expense.note || "",
          });
        } else {
          toast.error(data.message || "Failed to fetch expense details");
          router.push("/expenses");
        }
      } catch (error) {
        toast.error("An error occurred while fetching expense details");
        router.push("/expenses");
      } finally {
        setFetching(false);
      }
    };

    fetchExpense();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("amount", formData.amount);
      dataToSend.append("category", formData.category);
      dataToSend.append("date", formData.date);
      dataToSend.append("note", formData.note);
      if (receipt) {
        dataToSend.append("receipt", receipt);
      }

      const response = await fetch(`/api/expence/${id}`, {
        method: "PUT",
        body: dataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Expense updated successfully");
        router.push("/expenses");
      } else {
        toast.error(data.message || "Failed to update expense");
      }
    } catch (error) {
      toast.error("An error occurred while updating the expense");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Edit Expense"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Expenses", href: "/expenses" },
          { label: "Edit Expense" },
        ]}
        backLink="/expenses"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transform transition-all">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Expense Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="electricity">Electricity</option>
                <option value="rent">Rent</option>
                <option value="water">Water</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Transaction Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Update Receipt (Optional)</label>
            <div className="relative">
              <input
                type="file"
                id="receipt"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf"
              />
              <label
                htmlFor="receipt"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all group"
              >
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                  <p className="text-sm text-gray-500 group-hover:text-indigo-600 font-medium">
                    {receipt ? receipt.name : "Click to upload a new receipt"}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Extra Note</label>
            <textarea
              name="note"
              rows={4}
              value={formData.note}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-xs font-sans"
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-4 mt-8 border-t border-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/expenses")}
              className="px-8 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="px-10 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
