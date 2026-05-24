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
import clsx from "clsx";

export default function AddExpensePage() {
  const router = useRouter();
  const { color, darkColor, mode } = useSelector((state: any) => state.theme);
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
    <div className="bg-transparent min-h-screen font-public-sans">
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
            <div className={clsx(
              "rounded-xl p-8 md:p-10 border",
              mode === "dark"
                ? "bg-[#1c252e] border-gray-800 shadow-none ring-0"
                : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]"
            )}>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Header */}
                <div className={clsx(
                  "flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b",
                  mode === "dark" ? "border-gray-800" : "border-gray-100"
                )}>
                  <div 
                    style={{color: mode === "dark" ? "#818cf8" : color, backgroundColor: mode === "dark" ? "rgba(129,140,248,0.15)" : darkColor + "15"}} 
                    className={clsx(
                      "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0",
                      mode === "dark" ? "border-slate-800" : "border-gray-100 text-gray-700"
                    )}
                  >
                    <Icon icon="solar:wallet-money-bold-duotone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className={clsx("text-lg font-semibold leading-tight", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Expense Details</h3>
                    <p className={clsx("text-sm", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Enter the transaction details to track your library spending.</p>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div>
                    <label className={clsx("block text-[15px] font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Expense Title</label>
                    <p className={clsx("text-[13px] mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Give your expense a clear and concise name (e.g., Office Rent).</p>
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Office Rent, Electricity Bill"
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl text-[15px] outline-none transition-all border",
                      mode === "dark"
                        ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        : "bg-white border border-gray-300/60 text-gray-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400"
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <div>
                      <label className={clsx("block text-[15px] font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Amount</label>
                      <p className={clsx("text-[13px] mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Total cost of the transaction.</p>
                    </div>
                    <div className={clsx(
                      "flex items-stretch rounded-xl overflow-hidden transition-all border",
                      mode === "dark"
                        ? "bg-slate-900 border-gray-800 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600"
                        : "bg-white border border-gray-300/60 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-400"
                    )}>
                      <div className={clsx(
                        "border-r px-4 flex items-center justify-center text-[15px] font-bold shrink-0",
                        mode === "dark"
                          ? "bg-slate-800 border-gray-850 text-slate-400"
                          : "bg-gray-50/80 border-r border-gray-300/80 text-gray-500"
                      )}>
                        ₹
                      </div>
                      <input
                        type="number"
                        name="amount"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={clsx(
                          "flex-1 w-full px-4 py-3 bg-transparent outline-none text-[15px] font-mono",
                          mode === "dark" ? "text-white" : "text-gray-900"
                        )}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <div>
                      <label className={clsx("block text-[15px] font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Category</label>
                      <p className={clsx("text-[13px] mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Classify this expense.</p>
                    </div>
                    <div className="relative">
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className={clsx(
                          "w-full px-4 py-3 rounded-xl text-[15px] outline-none transition-all appearance-none cursor-pointer border",
                          mode === "dark"
                            ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                            : "bg-white border border-gray-300/60 text-gray-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400"
                        )}
                      >
                        <option value="electricity" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>Electricity</option>
                        <option value="rent" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>Rent</option>
                        <option value="water" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>Water</option>
                        <option value="maintenance" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>Maintenance</option>
                        <option value="other" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>Other</option>
                      </select>
                      <div className={clsx("absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none", mode === "dark" ? "text-slate-400" : "text-gray-500")}>
                        <Icon icon="solar:alt-arrow-down-linear" width={20} height={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <div>
                    <label className={clsx("block text-[15px] font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Transaction Date</label>
                    <p className={clsx("text-[13px] mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>When was this payment made?</p>
                  </div>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl text-[15px] outline-none transition-all cursor-pointer border",
                      mode === "dark"
                        ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        : "bg-white border border-gray-300/60 text-gray-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400"
                    )}
                  />
                </div>

                {/* Receipt */}
                <div className="space-y-2">
                  <div>
                    <label className={clsx("block text-[15px] font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Receipt (Optional)</label>
                    <p className={clsx("text-[13px] mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Upload a digital copy of the bill.</p>
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
                      className={clsx(
                        "flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-2xl cursor-pointer transition-all group relative overflow-hidden",
                        mode === "dark"
                          ? "border-gray-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-indigo-500/50"
                          : "border-gray-200 hover:bg-gray-50 hover:border-indigo-300"
                      )}
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
                          <div className={clsx(
                            "w-16 h-16 rounded-2xl flex items-center justify-center mb-3",
                            mode === "dark" ? "bg-indigo-950/40 text-indigo-400" : "bg-indigo-50 text-indigo-500"
                          )}>
                            <Icon icon="solar:document-bold-duotone" width={32} height={32} />
                          </div>
                          <p className={clsx("text-sm font-bold max-w-[200px] truncate", mode === "dark" ? "text-slate-200" : "text-gray-900")}>
                            {receipt.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {(receipt.size / 1024).toFixed(1)} KB
                          </p>
                          <button
                            onClick={handleRemoveReceipt}
                            className={clsx(
                              "mt-4 px-4 py-1.5 text-[11px] font-black uppercase tracking-tighter rounded-lg transition-colors",
                              mode === "dark" ? "bg-slate-800 text-gray-300 hover:bg-slate-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                          <Icon icon="solar:cloud-upload-bold-duotone" width={40} height={40} className={clsx(
                            "mb-2 transition-colors",
                            mode === "dark" ? "text-slate-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"
                          )} />
                          <p className={clsx(
                            "text-sm font-bold",
                            mode === "dark" ? "text-slate-400 group-hover:text-indigo-400" : "text-gray-500 group-hover:text-indigo-600"
                          )}>
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
                    <label className={clsx("block text-[15px] font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>Additional Notes</label>
                    <p className={clsx("text-[13px] mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Extra context about this expenditure.</p>
                  </div>
                  <textarea
                    name="note"
                    rows={4}
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Describe specific details about the expense..."
                    className={clsx(
                      "w-full px-4 py-3 rounded-xl text-[15px] outline-none transition-all resize-none shadow-xs border",
                      mode === "dark"
                        ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        : "bg-white border border-gray-300/60 text-gray-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400"
                    )}
                  ></textarea>
                </div>

                <div className="flex justify-end flex-col sm:flex-row gap-4 pt-4">
                   <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/expenses")}
                    className={clsx(
                      "py-3 font-medium font-bold text-[16px] rounded-xl transition-all border",
                      mode === "dark"
                        ? "border-gray-800 text-gray-300 hover:bg-slate-800 bg-transparent hover:text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon="solar:wallet-bold-duotone"
                    disabled={loading}
                    className={clsx(
                      "py-3 font-medium rounded-xl font-bold text-[16px] transition-all flex items-center justify-center gap-2",
                      mode === "dark"
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-none border-indigo-600 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200"
                    )}
                    color={mode === "dark" ? undefined : "#111827"}
                    hoverColor={mode === "dark" ? undefined : "#1f2937"}
                  >
                    Save Expense
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Summary */}
          <div className="space-y-6">
            <div className={clsx(
              "rounded-xl p-8 border sticky top-8",
              mode === "dark"
                ? "bg-[#1c252e] border-gray-800 shadow-none"
                : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]"
            )}>
              <h3 className={clsx("text-lg font-barlow font-bold mb-6 uppercase tracking-tight", mode === "dark" ? "text-slate-200" : "text-gray-800")}>Preview</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className={clsx("font-semibold tracking-wide uppercase text-[11px]", mode === "dark" ? "text-slate-400" : "text-gray-500")}>Title</span>
                  <span className={clsx("font-bold truncate max-w-[150px]", mode === "dark" ? "text-slate-100" : "text-gray-900")}>{formData.title || "---"}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className={clsx("font-semibold tracking-wide uppercase text-[11px]", mode === "dark" ? "text-slate-400" : "text-gray-500")}>Category</span>
                  <StatusBadge status={formData.category} />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={clsx("font-semibold tracking-wide uppercase text-[11px]", mode === "dark" ? "text-slate-400" : "text-gray-500")}>Date</span>
                  <span className={clsx("font-bold", mode === "dark" ? "text-slate-100" : "text-gray-900")}>
                    {formData.date ? new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "---"}
                  </span>
                </div>

                <div className={clsx(
                  "pt-6 border-t border-dashed",
                  mode === "dark" ? "border-gray-850" : "border-gray-200"
                )}>
                  <div className="flex justify-between items-end">
                    <span className={clsx("font-semibold tracking-wide text-xs uppercase", mode === "dark" ? "text-slate-400" : "text-gray-500")}>Total Amount</span>
                    <span className={clsx("text-2xl font-barlow font-bold", mode === "dark" ? "text-indigo-400" : "text-indigo-600")}>₹{parseFloat(formData.amount || "0").toLocaleString()}</span>
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
