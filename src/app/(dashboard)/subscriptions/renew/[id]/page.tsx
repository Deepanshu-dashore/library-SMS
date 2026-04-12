"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  RefreshCcw, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2,
  Armchair,
  User
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";

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
      <div className="max-w-[900px] mx-auto p-4 md:p-8">
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
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex items-start gap-6">
               <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
                  <Armchair size={32} />
               </div>
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-900">Seat {subscription.seatId.seatNumber}</h2>
                  <p className="text-[13px] font-bold text-gray-500 flex items-center gap-2">
                     <User size={14} className="text-indigo-400" />
                     {subscription.userId.name}
                  </p>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest pt-2">
                     Current End: {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Duration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                       <Clock size={20} />
                     </div>
                     <h3 className="text-lg font-black text-gray-900">Renewal Duration</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[15px] font-semibold text-gray-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                    />
                    <span className="text-[14px] font-black text-gray-500 uppercase tracking-widest">Days</span>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Payment Mode</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {["cash", "upi", "card"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMode: mode })}
                        className={`py-4 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[12px] ${
                          formData.paymentMode === mode
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  <RefreshCcw size={24} className={loading ? "animate-spin" : ""} />
                  Confirm Renewal
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6">Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Renewal Fee</span>
                  <span className="text-indigo-600 font-black text-2xl">₹{estimatedAmount}</span>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-100 space-y-4">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                         <Calendar size={16} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[11px] font-black text-green-900 uppercase tracking-tight">New End Date</p>
                         <p className="text-sm font-semibold text-green-800">
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
