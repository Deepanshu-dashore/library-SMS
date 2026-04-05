"use client";

import React, { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Calendar, Tag, CreditCard, FileText, StickyNote } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface ViewExpenseProps {
  params: Promise<{ id: string }>;
}

export default function ViewExpensePage({ params }: ViewExpenseProps) {
  const { id } = use(params);
  const router = useRouter();
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
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!expense) return null;

  return (
    <div className="p-6 h-full flex flex-col font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Expense Details"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Expenses", href: "/expenses" },
          { label: "View Details" },
        ]}
        backLink="/expenses"
      />

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner Section */}
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                 <span className="text-[11px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">Transaction Record</span>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">{expense.title}</h2>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Amount Paid</span>
                 <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{expense.amount.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="p-10 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Category */}
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                    <Tag className="w-5 h-5 text-gray-400" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Category</p>
                    <StatusBadge status={expense.category} size="md" />
                 </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                    <Calendar className="w-5 h-5 text-gray-400" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Transaction Date</p>
                    <p className="text-lg font-bold text-gray-800">
                       {new Date(expense.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                       })}
                    </p>
                 </div>
              </div>

              {/* Expense ID */}
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Reciept Number</p>
                    <p className="font-mono text-gray-800 font-bold">{expense._id.slice(-8).toUpperCase()}</p>
                 </div>
              </div>

              {/* Attachment */}
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                    <FileText className="w-5 h-5 text-gray-400" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Attachment</p>
                    {expense.receipt ? (
                       <a href={expense.receipt} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">View Receipt Attachment</a>
                    ) : (
                       <p className="text-gray-400 italic">No receipt attached</p>
                    )}
                 </div>
              </div>
           </div>

           {/* Notes Section */}
           <div className="pt-10 border-t border-gray-50 space-y-4">
              <div className="flex items-center gap-2">
                 <StickyNote className="w-5 h-5 text-indigo-500 rounded-sm" />
                 <h3 className="text-[14px] font-black uppercase tracking-widest text-gray-900 underline decoration-indigo-200 underline-offset-4 decoration-2">Administrative Note</h3>
              </div>
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                 <p className="text-gray-600 leading-relaxed font-medium">
                    {expense.note || "No additional notes provided for this transaction."}
                 </p>
              </div>
           </div>

           {/* Actions */}
           <div className="flex justify-end gap-4 pt-10 mt-10 border-t border-gray-50">
              <button
                 onClick={() => router.push(`/expenses/edit/${id}`)}
                 className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                 Edit Details
              </button>
              <button
                 onClick={() => router.push("/expenses")}
                 className="px-8 py-3.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
              >
                 Close
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
