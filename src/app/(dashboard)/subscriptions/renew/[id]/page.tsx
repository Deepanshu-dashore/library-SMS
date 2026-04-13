"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { useSelector } from "react-redux";

interface SubscriptionDetails {
  subscription: {
    _id: string;
    userId: { name: string, email: string };
    seatId: { seatNumber: string, price: number };
    startDate: string;
    endDate: string;
    status: string;
  };
}

export default function RenewSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { color, darkColor } = useSelector((state: any) => state.theme);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<SubscriptionDetails | null>(null);
  
  const [formData, setFormData] = useState({
    durationDays: 30,
    paymentMode: "cash"
  });

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await fetch(`/api/subscription/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          toast.error(result.message || "Failed to load subscription");
        }
      } catch (error) {
        toast.error("Failed to fetch subscription details");
      } finally {
        setFetching(false);
      }
    };
    fetchSub();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Renewing subscription...");
    try {
      const res = await fetch("/api/subscription/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: id,
          ...formData
        })
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Subscription renewed successfully!", { id: loadingToast });
        router.push("/subscriptions");
      } else {
        toast.error(result.message || "Failed to renew", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center font-bold text-gray-400">Loading subscription details...</div>;
  if (!data) return <div className="p-8 text-center font-bold text-red-500">Subscription not found</div>;

  const { subscription } = data;
  const estimatedAmount = Math.round((subscription.seatId.price / 30) * formData.durationDays);

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Renew Subscription"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Renew" }
          ]}
          backLink="/subscriptions"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 flex items-start gap-6">
               <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Icon icon="solar:armchair-bold-duotone" width={32} height={32} />
               </div>
               <div className="space-y-1 w-full">
                  <h2 className="text-xl font-barlow font-bold text-gray-900">Seat {subscription.seatId.seatNumber}</h2>
                  <div className="flex items-center justify-between w-full">
                  <p className="text-[13px] font-public-sans font-bold text-gray-500 flex items-center gap-2">
                     <Icon icon="solar:user-bold-duotone" width={16} height={16} className="text-indigo-400" />
                     {subscription.userId.name}
                  </p>
                  <p className="text-[11px] font-public-sans font-bold text-gray-600 uppercase tracking-widest pt-2">
                     Current End: <span className="text-gray-400">{new Date(subscription.endDate).toLocaleDateString()}</span>
                  </p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div style={{color,backgroundColor:darkColor+"15"}} className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                    <Icon icon="solar:refresh-circle-bold-duotone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">Configure Renewal</h3>
                    <p className="text-sm font-public-sans text-gray-500">Extend the duration and select payment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-2">
                  {/* Duration */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[15px] font-public-sans font-bold text-gray-900">Duration</label>
                      <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Number of days to extend the subscription.</p>
                    </div>
                    <div className="flex items-stretch rounded-xl border border-gray-300/60 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-400 transition-all overflow-hidden bg-white">
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.durationDays}
                        onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                        className="flex-1 w-full px-4 py-4 bg-transparent outline-none text-[15px] font-public-sans text-gray-900 font-mono"
                      />
                      <div className="bg-gray-50/80 border-l border-gray-300/80 px-4 flex items-center justify-center text-[13px] font-public-sans font-bold text-gray-500 uppercase tracking-widest shrink-0">
                        Days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="space-y-2 pt-2">
                  <div>
                    <label className="block text-[15px] font-public-sans font-bold text-gray-900">Payment Mode</label>
                    <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Select how the user paid for this renewal.</p>
                  </div>
                  <div className="relative">
                    <select
                      required
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300/60 rounded-xl text-[15px] font-public-sans text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all appearance-none cursor-pointer"
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <Icon icon="solar:alt-arrow-down-linear" width={20} height={20} />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full py-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-public-sans font-bold text-[16px] transition-all flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:check-circle-bold" width={20} height={20} />
                  Confirm Renewal
                </Button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 sticky top-8">
              <h3 className="text-2xl font-barlow font-bold text-gray-900 mb-6">Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center font-public-sans text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide">Renewal Fee</span>
                  <span className="text-gray-900 font-bold">₹{estimatedAmount}</span>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200 space-y-4">
                   <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-100/50 flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0">
                         <Icon icon="solar:calendar-bold-duotone" width={20} height={20} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[11px] font-public-sans font-bold text-emerald-900/60 tracking-wider uppercase">New End Date</p>
                         <p className="text-[15px] font-public-sans font-bold text-emerald-900">
                            {(() => {
                               const base = new Date(subscription.endDate) > new Date() ? new Date(subscription.endDate) : new Date();
                               const date = new Date(base);
                               date.setDate(date.getDate() + formData.durationDays);
                               return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
                            })()}
                         </p>
                      </div>
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
