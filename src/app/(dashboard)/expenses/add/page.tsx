"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { useSelector } from "react-redux";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function AddExpensePage() {
  const router = useRouter();
  const { color, darkColor } = useSelector((state: any) => state.theme);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveReceipt = (e: React.MouseEvent) => {
    e.preventDefault();
    setReceipt(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Saving expense...");

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

      const response = await fetch("/api/expence", {
        method: "POST",
        body: dataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Expense added successfully", { id: loadingToast });
        router.push("/expenses");
      } else {
        toast.error(data.message || "Failed to add expense", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred while adding the expense", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen font-public-sans">
      <div className="max-w-6xl">
        <PageHeader
          title="Add New Expense"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Expenses", href: "/expenses" },
            { label: "Add" },
          ]}
          backLink="/expenses"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div style={{color, backgroundColor: darkColor + "15"}} className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                    <Icon icon="solar:wallet-money-bold-duotone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">Expense Details</h3>
                    <p className="text-sm text-gray-500">Enter the transaction details to track your library spending.</p>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[15px] font-bold text-gray-900">Expense Title</label>
                    <p className="text-[13px] text-gray-500 mt-0.5 mb-2">Give your expense a clear and concise name (e.g., Office Rent).</p>
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Office Rent, Electricity Bill"
                    className="w-full px-4 py-3 bg-white border border-gray-300/60 rounded-xl text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[15px] font-bold text-gray-900">Amount</label>
                      <p className="text-[13px] text-gray-500 mt-0.5 mb-2">Total cost of the transaction.</p>
                    </div>
                    <div className="flex items-stretch rounded-xl border border-gray-300/60 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-400 transition-all overflow-hidden bg-white">
                      <div className="bg-gray-50/80 border-r border-gray-300/80 px-4 flex items-center justify-center text-[15px] font-bold text-gray-500 shrink-0">
                        ₹
                      </div>
                      <input
                        type="number"
                        name="amount"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="flex-1 w-full px-4 py-3 bg-transparent outline-none text-[15px] text-gray-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[15px] font-bold text-gray-900">Category</label>
                      <p className="text-[13px] text-gray-500 mt-0.5 mb-2">Classify this expense.</p>
                    </div>
                    <div className="relative">
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300/60 rounded-xl text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all appearance-none cursor-pointer"
                      >
                        <option value="electricity">Electricity</option>
                        <option value="rent">Rent</option>
                        <option value="water">Water</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <Icon icon="solar:alt-arrow-down-linear" width={20} height={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[15px] font-bold text-gray-900">Transaction Date</label>
                    <p className="text-[13px] text-gray-500 mt-0.5 mb-2">When was this payment made?</p>
                  </div>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300/60 rounded-xl text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all cursor-pointer"
                  />
                </div>

                {/* Receipt */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[15px] font-bold text-gray-900">Receipt (Optional)</label>
                    <p className="text-[13px] text-gray-500 mt-0.5 mb-2">Upload a digital copy of the bill.</p>
                  </div>
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
                      className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all group relative overflow-hidden"
                    >
                      {previewUrl ? (
                        <div className="absolute inset-0 w-full h-full group">
                          <img 
                            src={previewUrl} 
                            alt="Receipt Preview" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="bg-white backdrop-blur-md p-3 rounded-lg border border-white/30 text-black flex items-center gap-2">
                                <Icon icon="solar:camera-rotate-bold" width={20} />
                                <span className="text-xs font-bold tracking-wide">Change Image</span>
                             </div>
                          </div>
                          <button
                            onClick={handleRemoveReceipt}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-95 z-20"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" width={18} />
                          </button>
                        </div>
                      ) : receipt ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
                            <Icon icon="solar:document-bold-duotone" width={32} height={32} />
                          </div>
                          <p className="text-sm text-gray-900 font-bold max-w-[200px] truncate">
                            {receipt.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {(receipt.size / 1024).toFixed(1)} KB
                          </p>
                          <button
                            onClick={handleRemoveReceipt}
                            className="mt-4 px-4 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-black uppercase tracking-tighter rounded-lg hover:bg-gray-200"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                          <Icon icon="solar:cloud-upload-bold-duotone" width={40} height={40} className="text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                          <p className="text-sm text-gray-500 group-hover:text-indigo-600 font-bold">
                            Click to upload receipt
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[15px] font-bold text-gray-900">Additional Notes</label>
                    <p className="text-[13px] text-gray-500 mt-0.5 mb-2">Extra context about this expenditure.</p>
                  </div>
                  <textarea
                    name="note"
                    rows={4}
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Describe specific details about the expense..."
                    className="w-full px-4 py-3 bg-white border border-gray-300/60 rounded-xl text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all resize-none shadow-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end flex-col sm:flex-row gap-4 pt-4">
                   <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/expenses")}
                    className="py-3 font-medium border-gray-200 text-gray-600 font-bold text-[16px] rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon="solar:wallet-bold-duotone"
                    disabled={loading}
                    className="py-3 font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                  >
                    Save Expense
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 sticky top-8">
              <h3 className="text-lg font-barlow font-bold text-gray-800 mb-6 uppercase tracking-tight">Preview</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide uppercase text-[11px]">Title</span>
                  <span className="text-gray-900 font-bold truncate max-w-[150px]">{formData.title || "---"}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide uppercase text-[11px]">Category</span>
                  <StatusBadge status={formData.category} />
                  {/* <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700 font-bold text-[12px] uppercase">{formData.category}</span> */}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide uppercase text-[11px]">Date</span>
                  <span className="text-gray-900 font-bold">
                    {formData.date ? new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "---"}
                  </span>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-semibold tracking-wide text-xs uppercase">Total Amount</span>
                    <span className="text-2xl font-barlow font-bold text-indigo-600">₹{parseFloat(formData.amount || "0").toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
