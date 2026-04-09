"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Receipt, 
  User, 
  CreditCard, 
  Calendar, 
  BadgeCheck, 
  Download,
  Printer,
  ChevronLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";

interface PaymentDetails {
  _id: string;
  userId: { name: string, email: string, number: string };
  subscriptionId: {
    startDate: string;
    endDate: string;
    status: string;
  };
  amount: number;
  paymentMode: string;
  durationDays: number;
  receiptNumber: string;
  createdAt: string;
}

export default function ViewPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`/api/payment/${id}`);
        const result = await res.json();
        if (result.success) {
          setPayment(result.data);
        } else {
          toast.error(result.message || "Failed to load payment record");
        }
      } catch (error) {
        toast.error("An error occurred while fetching details");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-10 text-center font-black text-gray-400">Crunching payment data...</div>;
  if (!payment) return <div className="p-10 text-center font-black text-red-500">Receipt record not found</div>;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-[800px] mx-auto p-4 md:p-8">
        <PageHeader 
          title="Payment Receipt"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments", href: "/payments" },
            { label: payment.receiptNumber }
          ]}
          backLink="/payments"
          actionNode={
            <div className="flex gap-4">
               <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-black hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
               >
                  <Printer size={18} />
                  Print Receipt
               </button>
            </div>
          }
        />

        <div className="bg-white rounded-[48px] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100 print:shadow-none print:border-none">
          {/* Header Strip */}
          <div className="bg-indigo-600 p-10 text-white flex justify-between items-center">
             <div>
                <p className="text-indigo-200 text-[11px] font-black uppercase tracking-widest mb-1">Receipt Number</p>
                <h2 className="text-3xl font-black tracking-tight font-mono">{payment.receiptNumber}</h2>
             </div>
             <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                <BadgeCheck size={32} />
             </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Amount Section */}
            <div className="text-center py-8 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
               <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-2">Total Amount Paid</p>
               <h3 className="text-6xl font-black text-indigo-600 tracking-tighter">₹{payment.amount}</h3>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full mt-4 text-[12px] font-black uppercase tracking-widest border border-green-100">
                  <BadgeCheck size={14} />
                  Verified Payment
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Member Details */}
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <User size={14} /> Member Details
                  </h4>
                  <div className="space-y-1">
                     <p className="text-xl font-black text-gray-900">{payment.userId.name}</p>
                     <p className="text-sm font-bold text-gray-500">{payment.userId.email}</p>
                     <p className="text-sm font-bold text-indigo-600">{payment.userId.number}</p>
                  </div>
               </div>

               {/* Payment Info */}
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <CreditCard size={14} /> Payment Info
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Method</p>
                        <p className="font-bold text-gray-900 uppercase tracking-widest">{payment.paymentMode}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Paid On</p>
                        <p className="font-bold text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Subscription Validity */}
            <div className="pt-10 border-t border-gray-100">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Calendar size={14} /> Subscription Coverage
               </h4>
               <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts From</p>
                     <p className="font-black text-gray-800">{new Date(payment.subscriptionId.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="w-10 h-[2px] bg-gray-200 hidden sm:block" />
                  <div className="flex flex-col gap-1 text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ends On</p>
                     <p className="font-black text-indigo-600">{new Date(payment.subscriptionId.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
               </div>
               <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">
                  Total Membership Grace: {payment.durationDays} Days
               </p>
            </div>
          </div>

          {/* Footer Logo/Brand */}
          <div className="p-10 bg-gray-50 border-t border-gray-100 text-center">
             <h5 className="font-black text-sm text-gray-400 tracking-widest uppercase">Library SMS Receipt</h5>
             <p className="text-[10px] text-gray-400 mt-1">This is a system generated e-receipt. Thank you for your payment!</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
