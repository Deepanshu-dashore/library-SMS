"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { useSelector } from "react-redux";
import clsx from "clsx";

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
  const { color, darkColor, mode } = useSelector((state: any) => state.theme);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<SubscriptionDetails | null>(null);
  
  const [formData, setFormData] = useState({
    durationDays: 30,
    paymentMode: "cash"
  });

  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState<{ mode: string; amount: number }[]>([]);

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

    if (isSplitPayment) {
      const total = splitPayments.reduce((s, p) => s + (p.amount || 0), 0);
      if (total !== estimatedAmount) {
        toast.error(`Split payments total must be exactly ₹${estimatedAmount}`);
        return;
      }
      const hasInvalidAmount = splitPayments.some(p => (p.amount || 0) <= 0);
      if (hasInvalidAmount) {
        toast.error("Please enter a valid amount for all split payments");
        return;
      }
    }

    setLoading(true);
    const loadingToast = toast.loading("Renewing subscription...");
    try {
      const res = await fetch("/api/subscription/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: id,
          durationDays: formData.durationDays,
          splitPayments: isSplitPayment ? splitPayments : undefined,
          paymentMode: isSplitPayment ? undefined : formData.paymentMode
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

  const handleToggleSplit = () => {
    setIsSplitPayment(!isSplitPayment);
    if (!isSplitPayment && splitPayments.length === 0) {
      setSplitPayments([{ mode: "cash", amount: estimatedAmount }]);
    }
  };

  return (
    <div className={clsx(mode === "dark" ? "bg-transparent" : "bg-gray-50/50", "min-h-screen")}>
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
            <div className={clsx("rounded-xl p-8 md:p-10 border flex items-start gap-6", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none" : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]")}>
               <div className={clsx("w-16 h-16 rounded-xl flex items-center justify-center shrink-0", mode === "dark" ? "bg-indigo-950/40 text-indigo-400" : "bg-indigo-50 text-indigo-600")}>
                  <Icon icon="solar:armchair-bold-duotone" width={32} height={32} />
               </div>
               <div className="space-y-1 w-full">
                  <h2 className={clsx("text-xl font-barlow font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>Seat {subscription.seatId.seatNumber}</h2>
                  <div className="flex items-center justify-between w-full">
                  <p className={clsx("text-[13px] font-public-sans font-bold flex items-center gap-2", mode === "dark" ? "text-gray-300" : "text-gray-500")}>
                     <Icon icon="solar:user-bold-duotone" width={16} height={16} className="text-indigo-400" />
                     {subscription.userId.name}
                  </p>
                  <p className={clsx("text-[11px] font-public-sans font-bold uppercase tracking-widest pt-2", mode === "dark" ? "text-gray-400" : "text-gray-600")}>
                     Current End: <span className={clsx(mode === "dark" ? "text-gray-300" : "text-gray-400")}>{new Date(subscription.endDate).toLocaleDateString()}</span>
                  </p>
                  </div>
               </div>
            </div>

            <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none" : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]")}>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Header */}
                <div className={clsx("flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                  <div className={clsx("w-12 h-12 rounded-xl border flex items-center justify-center shrink-0", mode === "dark" ? "bg-indigo-950/30 border-indigo-900/50 text-indigo-400" : "border-gray-100 text-gray-700")} style={mode === "dark" ? {} : {color,backgroundColor:darkColor+"15"}}>
                    <Icon icon="solar:refresh-circle-bold-duotone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className={clsx("text-lg font-semibold leading-tight", mode === "dark" ? "text-white" : "text-gray-900")}>Configure Renewal</h3>
                    <p className={clsx("text-sm font-public-sans", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Extend the duration and select payment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-2">
                  {/* Duration */}
                  <div className="space-y-2">
                    <div>
                      <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Duration</label>
                      <p className={clsx("text-[13px] font-public-sans mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Number of days to extend the subscription.</p>
                    </div>
                    <div className={clsx("flex items-stretch rounded-xl border transition-all overflow-hidden", mode === "dark" ? "border-gray-800 bg-slate-900 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-700" : "bg-white border-gray-300/60 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-400")}>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.durationDays}
                        onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 })}
                        className={clsx("flex-1 w-full px-4 py-4 bg-transparent outline-none text-[15px] font-public-sans font-mono", mode === "dark" ? "text-white" : "text-gray-900")}
                      />
                      <div className={clsx("border-l px-4 flex items-center justify-center text-[13px] font-public-sans font-bold uppercase tracking-widest shrink-0", mode === "dark" ? "bg-slate-950/40 border-gray-800 text-slate-500" : "bg-gray-50/80 border-gray-300/80 text-gray-500")}>
                        Days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Payment Details</label>
                      <p className={clsx("text-[13px] font-public-sans mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Select payment mode or split between multiple modes.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleSplit}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center gap-2",
                        isSplitPayment
                          ? (mode === "dark" ? "bg-amber-950/20 text-amber-500 border-amber-900/40" : "bg-amber-50 text-amber-600 border-amber-200")
                          : (mode === "dark" ? "bg-slate-900 text-gray-400 border-gray-800 hover:bg-slate-800" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100")
                      )}
                    >
                      <Icon icon={isSplitPayment ? "solar:close-circle-bold" : "solar:bill-list-bold"} width={16} />
                      {isSplitPayment ? "Cancel Split Payment" : "Enable Split Payment"}
                    </button>
                  </div>

                  {!isSplitPayment ? (
                    <div className="relative">
                      <select
                        required
                        value={formData.paymentMode}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                        className={clsx("w-full px-4 py-4 border rounded-xl text-[15px] font-public-sans outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all appearance-none cursor-pointer", mode === "dark" ? "bg-slate-900 border-gray-800 text-white" : "bg-white border-gray-300/60 text-gray-900")}
                      >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <Icon icon="solar:alt-arrow-down-linear" width={20} height={20} />
                      </div>
                    </div>
                  ) : (
                    <div className={clsx("space-y-3 p-4 rounded-xl border", mode === "dark" ? "bg-slate-900/40 border-gray-800" : "bg-gray-50/50 border-gray-200/60")}>
                      {splitPayments.map((payment, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-end">
                          <div className="flex-1 w-full">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block px-1">Mode</label>
                            <div className="relative">
                              <select
                                value={payment.mode}
                                onChange={(e) => {
                                  const newPayments = [...splitPayments];
                                  newPayments[index].mode = e.target.value;
                                  setSplitPayments(newPayments);
                                }}
                                className={clsx("w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all border", mode === "dark" ? "bg-slate-900 border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-800")}
                              >
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                              </select>
                              <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1 w-full">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block px-1">Amount</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={payment.amount}
                              onChange={(e) => {
                                const newPayments = [...splitPayments];
                                newPayments[index].amount = parseInt(e.target.value) || 0;
                                setSplitPayments(newPayments);
                              }}
                              className={clsx("w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all font-mono border", mode === "dark" ? "bg-slate-900 border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-800")}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newPayments = splitPayments.filter((_, i) => i !== index);
                              setSplitPayments(newPayments);
                              if (newPayments.length === 0) setIsSplitPayment(false);
                            }}
                            className={clsx("p-3 rounded-lg transition-all shrink-0 border", mode === "dark" ? "bg-red-950/20 border-red-900/30 text-red-400 hover:bg-red-950/40" : "bg-white border-red-100 text-red-500 hover:bg-red-50")}
                          >
                            <Icon icon="solar:trash-bin-trash-bold" width={20} />
                          </button>
                        </div>
                      ))}

                      <div className={clsx("flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 mt-3 border-t border-dashed", mode === "dark" ? "border-gray-800" : "border-gray-200")}>
                        <button
                          type="button"
                          onClick={() => setSplitPayments([...splitPayments, { mode: "cash", amount: 0 }])}
                          className={clsx("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border", mode === "dark" ? "bg-indigo-950/40 text-indigo-400 border-indigo-900/50 hover:bg-indigo-950/60" : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100")}
                        >
                          <Icon icon="solar:add-circle-bold" width={18} />
                          Add Payment Row
                        </button>

                        <div className={clsx("flex items-center gap-3 px-4 py-1.5 rounded-lg border", mode === "dark" ? "bg-amber-950/20 border-amber-900/40" : "bg-amber-100")}>
                          <span className={clsx("text-[11px] font-barlow font-semibold uppercase", mode === "dark" ? "text-amber-400" : "text-gray-600")}>Total Split:</span>
                          <span className={`text-sm font-bold ${splitPayments.reduce((s, p) => s + p.amount, 0) !== estimatedAmount ? "text-red-500" : "text-emerald-700"}`}>
                            ₹{splitPayments.reduce((s, p) => s + p.amount, 0)} / ₹{estimatedAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
            <div className={clsx("rounded-xl p-8 border sticky top-8", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none" : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]")}>
              <h3 className={clsx("text-2xl font-barlow font-bold mb-6", mode === "dark" ? "text-white" : "text-gray-900")}>Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center font-public-sans text-sm">
                  <span className={clsx("font-semibold tracking-wide", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Renewal Fee</span>
                  <span className={clsx("font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>₹{estimatedAmount}</span>
                </div>

                {isSplitPayment && splitPayments.length > 0 && (
                  <div className={clsx("p-4 rounded-xl space-y-3 border", mode === "dark" ? "bg-slate-900/60 border-gray-800" : "bg-gray-50 border-gray-100")}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Payment Breakdown</p>
                    <div className="space-y-2">
                      {splitPayments.map((p, i) => (
                        <div key={i} className="flex justify-between items-center text-xs font-public-sans px-1">
                          <span className={clsx("font-medium capitalize", mode === "dark" ? "text-gray-400" : "text-gray-500")}>{p.mode}</span>
                          <span className={clsx("font-bold font-mono", mode === "dark" ? "text-white" : "text-gray-900")}>₹{p.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={clsx("pt-6 border-t border-dashed", mode === "dark" ? "border-gray-800" : "border-gray-200")}>
                   <div className={clsx("p-2 rounded-xl border flex gap-4 items-center", mode === "dark" ? "bg-emerald-950/20 border-emerald-900/30" : "bg-emerald-50/80 border-emerald-100/50")}>
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", mode === "dark" ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-100/90 text-emerald-600")}>
                         <Icon icon="solar:calendar-bold-duotone" width={20} height={20} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[11px] font-public-sans font-bold text-emerald-900/60 tracking-wider uppercase">New End Date</p>
                         <p className={clsx("text-[15px] font-public-sans font-bold", mode === "dark" ? "text-emerald-400" : "text-emerald-900")}>
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
