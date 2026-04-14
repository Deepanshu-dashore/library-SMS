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

import { Button } from "@/components/shared/Button";

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

  if (loading) return <div className="p-10 text-center font-black text-gray-300 animate-pulse">Processing Receipt...</div>;
  if (!payment) return <div className="p-10 text-center font-black text-rose-500 bg-rose-50 rounded-2xl mx-10 mt-10">Receipt record not found</div>;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[720px] mx-auto p-4 md:p-8">
        <PageHeader 
          title="Payment Details"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Payments", href: "/payments" },
            { label: `Receipt #${payment.receiptNumber}` }
          ]}
          actionNode={
            <div className="flex gap-3">
               <Button
                  onClick={() => router.push("/payments")}
                  variant="outline"
                  className="rounded-2xl px-5 py-2 font-bold text-gray-500 hover:text-gray-900"
               >
                  <ChevronLeft size={18} />
                  Back
               </Button>
               <Button
                  onClick={handlePrint}
                  variant="primary"
                  className="bg-gray-900 hover:bg-black rounded-2xl px-6 py-2 shadow-xl shadow-gray-200"
               >
                  <Printer size={18} />
                  Print Receipt
               </Button>
            </div>
          }
        />

        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 print:shadow-none print:border-none relative">
          
          {/* Header Strip */}
          <div className="bg-gray-900 p-8 md:p-12 text-white relative flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                   <BadgeCheck size={14} className="text-emerald-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Official E-Receipt</span>
                </div>
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Receipt ID</p>
                <h2 className="text-4xl font-black tracking-tighter font-barlow italic">{payment.receiptNumber}</h2>
             </div>
             
             <div className="text-left md:text-right relative z-10">
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Generated On</p>
                <p className="text-lg font-bold font-barlow">
                   {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Main Statement */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-dashed border-gray-100">
               <div>
                  <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2 font-public-sans">Payment Overview</p>
                  <h3 className="text-7xl font-black text-gray-900 tracking-tighter font-barlow">₹{payment.amount.toLocaleString()}</h3>
                  <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-sm bg-emerald-50 w-fit px-3 py-1 rounded-lg border border-emerald-100">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     Payment Successful
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 min-w-[200px]">
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Payment Mode</p>
                     <div className="flex items-center gap-2 text-gray-900">
                        <CreditCard size={18} className="text-indigo-500" />
                        <span className="text-lg font-black uppercase tracking-tight">{payment.paymentMode}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Grid for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Member Section */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <User size={16} />
                     </div>
                     <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Subscriber Details</span>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-2xl font-black text-gray-900 tracking-tight">{payment.userId.name}</h4>
                     <p className="flex items-center gap-2 text-gray-500 font-medium">{payment.userId.email}</p>
                     <p className="text-indigo-600 font-extrabold tracking-tight underline decoration-indigo-100 underline-offset-4 font-barlow text-lg">{payment.userId.number}</p>
                  </div>
               </div>

               {/* Subscription Section */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                     <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Calendar size={16} />
                     </div>
                     <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Subscription Validity</span>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active From</span>
                           <span className="font-bold text-gray-700">{new Date(payment.subscriptionId.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col text-right">
                           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Valid Until</span>
                           <span className="font-black text-amber-600 underline decoration-amber-100 decoration-4 underline-offset-2">{new Date(payment.subscriptionId.endDate).toLocaleDateString()}</span>
                        </div>
                     </div>
                     
                     <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 flex items-center justify-center gap-2">
                        <Receipt size={14} className="text-indigo-600" />
                        <span className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">
                           Duration: {payment.durationDays} Days Coverage
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Terms/Statement */}
            <div className="p-1 text-center bg-gray-50/50 rounded-2xl py-6 border border-gray-100 border-dashed">
               <p className="text-[11px] font-bold text-gray-400 leading-relaxed max-w-sm mx-auto">
                  By paying this amount, the subscriber agrees to the library's terms and conditions regarding membership usage and seat allocation.
               </p>
            </div>
          </div>

          {/* Clean Footer */}
          <div className="px-12 py-8 bg-gray-950 text-white flex flex-col md:flex-row items-center justify-between gap-4 border-t-8 border-indigo-500">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-indigo-500/20">L</div>
                <div className="flex flex-col">
                   <h5 className="font-black text-sm tracking-tight">LIBRARY SMS</h5>
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Management System</p>
                </div>
             </div>
             <p className="text-[10px] font-bold text-gray-500">
                This is a digitally signed receipt and requires no physical signature.
             </p>
          </div>
        </div>
        
        {/* Action Buttons Shadowy Container */}
        <div className="mt-8 flex justify-center pb-20">
           <Button 
            variant="outline" 
            className="rounded-full px-12 py-3 bg-white text-gray-400 hover:text-indigo-600 font-black border-none shadow-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           >
              Scroll to top
           </Button>
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

