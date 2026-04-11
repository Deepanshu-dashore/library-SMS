"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  User, 
  Armchair, 
  Calendar, 
  CreditCard, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";

interface SubscriptionDetails {
  subscription: {
    _id: string;
    userId: { name: string, email: string, number: string };
    seatId: { seatNumber: string, price: number, floor: string };
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
  };
  payment: Array<{
    amount: number;
    paymentMode: string;
    durationDays: number;
    receiptNumber: string;
    createdAt: string;
  }>;
}

export default function ViewSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/subscription/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          toast.error(result.message || "Failed to load details");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-black text-gray-400">Fetching records...</div>;
  if (!data) return <div className="p-10 text-center font-black text-red-500">Record not found</div>;

  const { subscription, payment } = data;
  const today = new Date();
  const endDate = new Date(subscription.endDate);
  const isExpired = endDate < today && subscription.status === "active";

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-[1000px] mx-auto p-4 md:p-8">
        <PageHeader 
          title="Subscription Details"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: subscription.userId.name }
          ]}
          backLink="/subscriptions"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Header */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                     <User size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{subscription.userId.name}</h2>
                    <p className="text-sm font-bold text-gray-500">{subscription.userId.email}</p>
                    <p className="text-sm font-bold text-indigo-600 mt-1">{subscription.userId.number}</p>
                  </div>
               </div>
               <div className="hidden sm:block text-right">
                  <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-widest ${
                    subscription.status === "cancelled" ? "bg-red-50 text-red-600 border border-red-100" :
                    isExpired ? "bg-amber-50 text-amber-600 border border-amber-100" :
                    "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                       subscription.status === "cancelled" ? "bg-red-600" :
                       isExpired ? "bg-amber-600" : "bg-green-600"
                    }`} />
                    {subscription.status === "cancelled" ? "Cancelled" : isExpired ? "Expired" : "Active"}
                  </div>
               </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <CreditCard className="text-indigo-600" />
                 Transaction History
              </h3>
              <div className="space-y-4">
                {payment.map((pay, i) => (
                  <div key={i} className="group p-6 rounded-[32px] border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-white flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                          <CheckCircle2 size={24} />
                       </div>
                       <div>
                          <p className="font-black text-gray-900">₹{pay.amount}</p>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{pay.paymentMode} • {pay.receiptNumber}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-700">{pay.durationDays} Days</p>
                       <p className="text-[11px] font-bold text-gray-400">{new Date(pay.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6">Subscription Info</h3>
              
              <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                       <Armchair size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Seat Number</p>
                       <p className="text-lg font-black text-indigo-600">Seat {subscription.seatId.seatNumber}</p>
                       <p className="text-xs font-bold text-gray-500">Floor: {subscription.seatId.floor || 'G'}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                       <Calendar size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Membership Period</p>
                       <p className="text-sm font-bold text-gray-900">{new Date(subscription.startDate).toLocaleDateString('en-GB')} - {new Date(subscription.endDate).toLocaleDateString('en-GB')}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                       <Clock size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Registered On</p>
                       <p className="text-sm font-bold text-gray-900">{new Date(subscription.createdAt).toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-10 p-5 bg-indigo-600 rounded-3xl text-white">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 text-center">Renewal Fee</p>
                 <p className="text-3xl font-black text-center">₹{subscription.seatId.price}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
