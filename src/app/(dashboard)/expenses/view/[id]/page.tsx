"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useSelector } from "react-redux";

interface ViewExpenseProps {
  params: Promise<{ id: string }>;
}

function HorizontalInfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 group py-4 border-b border-gray-100 border-dashed last:border-0 hover:bg-gray-50/50 transition-colors px-1">
      <span className="text-sm font-bold text-slate-800 w-44 shrink-0 uppercase tracking-tight">{label}:</span>
      <div className="text-sm font-bold text-slate-600 truncate flex-1 flex justify-end tracking-tight">
        {value || "—"}
      </div>
    </div>
  );
}

export default function ViewExpensePage({ params }: ViewExpenseProps) {
  const { id } = use(params);
  const router = useRouter();
  const { color } = useSelector((state: any) => state.theme);
  const [fetching, setFetching] = useState(true);
  const [expense, setExpense] = useState<any>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`/api/expence/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setExpense(data.data);
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

  if (fetching) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div style={{ borderColor: color, borderTopColor: "transparent" }} className="w-12 h-12 border-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!expense) return null;

  const isImage = expense.receipt && (expense.receipt.match(/\.(jpeg|jpg|gif|png|webp)$/i) || expense.receipt.includes("cloudinary"));

  return (
    <div className="bg-gray-50/50 min-h-screen font-public-sans pb-10">
      <div className="max-w-[1200px] mx-auto">
        <PageHeader
          title="View Transaction"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Expenses", href: "/expenses" },
            { label: "View Details" },
          ]}
          backLink="/expenses"
          actionNode={ 
               <div className="flex items-center gap-3">
                  <Button
                    onClick={() => router.push(`/expenses/edit/${id}`)}
                    variant="edit"
                    size="md"
                    className="font-medium"
                  >
                    Edit
                  </Button>
               </div>}
        />

          
          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_24px_48px_-8px_rgba(145,158,171,0.16)] border border-gray-100/80 overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-2">
               
               {/* Left Column: Information Rows */}
               <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Icon icon="solar:wallet-bold-duotone" width={22} className="text-indigo-600" />
                     </div>
                     <h3 className="text-base font-public-sans uppercase font-bold text-slate-900 tracking-wide">Expense Information</h3>
                  </div>

                  <div className="space-y-1">
                    <HorizontalInfoRow 
                      label="Expense Title" 
                      value={<span className=" capitalize">{expense.title}</span>} 
                    />
                    <HorizontalInfoRow 
                      label="Date" 
                      value={new Date(expense.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })} 
                    />
                    <HorizontalInfoRow 
                      label="Category" 
                      value={<StatusBadge status={expense.category} size="sm" />} 
                    />
                    <HorizontalInfoRow 
                      label="Amount Base" 
                      value={<span className="text-slate-900 font-black">₹{expense.amount.toLocaleString()}</span>} 
                    />
                    <HorizontalInfoRow 
                      label="Notes" 
                      value={<div className="text-right leading-relaxed text-slate-500 font-medium">
                        {expense.note || "No notes available"}
                      </div>} 
                    />
                  </div>
               </div>

               {/* Right Column: Receipt Section */}
               <div className="p-8 md:p-10 bg-slate-50/20 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                           <Icon icon="mdi:invoice-text" width={22} className="text-amber-600" />
                        </div>
                        <h3 className="text-base font-public-sans uppercase font-bold text-slate-900 tracking-wide">Receipt Attachment</h3>
                     </div>
                     {expense.receipt && (
                        <a 
                          href={expense.receipt} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[12px] font-medium uppercase text-indigo-600 hover:underline"
                        >
                           Expand View
                        </a>
                     )}
                  </div>

                  <div className="flex-1 min-h-[450px] flex rounded-lg border border-gray-200 bg-white shadow-inner overflow-hidden relative group">
                     {expense.receipt ? (
                        isImage ? (
                           <div className="w-full h-full flex items-center justify-center p-4">
                              <img 
                                src={expense.receipt} 
                                alt="Receipt Preview" 
                                className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                 <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                                    <Icon icon="solar:magnifer-zoom-in-bold" width={24} />
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="w-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                              <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                                 <Icon icon="solar:document-bold-duotone" width={36} height={36} />
                              </div>
                              <div className="space-y-1">
                                 <p className="font-black text-slate-900">PDF/Binary Format</p>
                                 <p className="text-[12px] font-bold text-slate-400">This receipt requires an external reader.</p>
                              </div>
                              <Button
                                 onClick={() => window.open(expense.receipt, '_blank')}
                                 variant="primary"
                                 className="mt-4 px-10 bg-slate-900 h-11"
                              >
                                 View Document
                              </Button>
                           </div>
                        )
                     ) : (
                        <div className="w-full flex flex-col items-center justify-center text-center p-10 space-y-3 grayscale opacity-40">
                           <Icon icon="solar:bill-cross-bold-duotone" width={48} className="text-gray-300" />
                           <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest">No receipt found</p>
                        </div>
                     )}
                  </div>
               </div>

            </div>
          </div>
        </div>
      </div>
  );
}
