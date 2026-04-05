"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Upload } from "lucide-react";

export default function AddExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [receipt, setReceipt] = useState<File | null>(null);

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
      const response = await fetch("/api/expence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Expense added successfully");
        router.push("/expenses");
      } else {
        toast.error(data.message || "Failed to add expense");
      }
    } catch (error) {
      toast.error("An error occurred while adding the expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Add New Expense"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Expenses", href: "/expenses" },
          { label: "Add Expense" },
        ]}
        backLink="/expenses"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Expense Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Office Rent, Electricity Bill"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold appearance-none bg-no-repeat bg-position-[right_1rem_center]"
              >
                <option value="electricity">Electricity</option>
                <option value="rent">Rent</option>
                <option value="water">Water</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Transaction Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
              />
            </div>
          </div>

          {/* Receipt Upload (UI Only) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Receipt (Optional)</label>
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
                    {receipt ? receipt.name : "Click to upload receipt"}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or PDF (Max 2MB)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Extra Note</label>
            <textarea
              name="note"
              rows={4}
              value={formData.note}
              onChange={handleChange}
              placeholder="Any additional details..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none shadow-xs"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 mt-8 border-t border-gray-50">
            <button
              type="button"
              onClick={() => router.push("/expenses")}
              className="px-8 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 bg-[#4f46e5] text-white rounded-xl font-bold text-sm hover:bg-[#4338ca] transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
