"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { useSelector } from "react-redux";

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
  const { color, darkColor } = useSelector((state: any) => state.theme);
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
      <div className="max-w-6xl mx-auto p-4 md:p-8">
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
            <div className="bg-white rounded-xl p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div style={{backgroundColor: darkColor ? darkColor + "15" : "#e0e7ff", color: color || "#4f46e5"}} className="w-16 h-16 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                     <Icon icon="solar:user-bold-duotone" width={32} height={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-barlow font-bold text-gray-900">{subscription.userId.name}</h2>
                    <p className="text-[14px] font-public-sans text-gray-500 font-semibold">{subscription.userId.email}</p>
                    <p className="text-[14px] font-public-sans text-indigo-600 font-semibold mt-0.5">{subscription.userId.number}</p>
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
            <div className="bg-white rounded-xl p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80">
              <h3 className="text-xl font-barlow font-bold text-gray-900 mb-6 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
                    <Icon icon="solar:card-2-bold-duotone" width={20} height={20} />
                 </div>
                 Transaction History
              </h3>
              <div className="space-y-4">
                {payment.map((pay, i) => (
                  <div key={i} className="group p-5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-indigo-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                          <Icon icon="solar:check-circle-bold-duotone" width={24} height={24} />
                       </div>
                       <div>
                          <p className="text-[16px] font-barlow font-bold text-gray-900">₹{pay.amount}</p>
                          <p className="text-[12px] font-public-sans font-bold text-gray-400 uppercase tracking-widest">{pay.paymentMode} • {pay.receiptNumber}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[14px] font-public-sans font-bold text-gray-700">{pay.durationDays} Days</p>
                       <p className="text-[12px] font-public-sans font-bold text-gray-400">{new Date(pay.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 sticky top-8">
              <h3 className="text-xl font-barlow font-bold text-gray-900 mb-6 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
                    <Icon icon="solar:info-circle-bold-duotone" width={20} height={20} />
                 </div>
                 Subscription Info
              </h3>
              
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                       <Icon icon="solar:armchair-bold-duotone" width={22} height={22} />
                    </div>
                    <div className="flex-1">
                       <p className="text-[11px] font-public-sans font-bold text-gray-400 uppercase tracking-widest mb-0.5">Seat Number</p>
                       <p className="text-[16px] font-barlow font-bold text-gray-900">Seat {subscription.seatId.seatNumber}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                       <Icon icon="solar:calendar-bold-duotone" width={22} height={22} />
                    </div>
                    <div className="flex-1">
                       <p className="text-[11px] font-public-sans font-bold text-gray-400 uppercase tracking-widest mb-0.5">Period</p>
                       <p className="text-[14px] font-public-sans font-semibold text-gray-900">{new Date(subscription.startDate).toLocaleDateString('en-GB')} - {new Date(subscription.endDate).toLocaleDateString('en-GB')}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                       <Icon icon="solar:clock-circle-bold-duotone" width={22} height={22} />
                    </div>
                    <div className="flex-1">
                       <p className="text-[11px] font-public-sans font-bold text-gray-400 uppercase tracking-widest mb-0.5">Registered On</p>
                       <p className="text-[14px] font-public-sans font-semibold text-gray-900">{new Date(subscription.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                 <p className="text-[11px] font-public-sans font-bold uppercase tracking-widest text-indigo-400 mb-1 text-center">Base Price</p>
                 <p className="text-[28px] font-barlow font-bold text-indigo-600 text-center">₹{subscription.seatId.price}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
