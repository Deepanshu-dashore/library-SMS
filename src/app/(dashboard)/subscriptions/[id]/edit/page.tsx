"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { useSelector } from "react-redux";
import { SimpleLoader } from "@/components/shared/SimpleLoader";

interface PaymentEntry {
  _id?: string;
  amount: number;
  paymentMode: string;
}

interface SubscriptionDetails {
  subscription: {
    _id: string;
    userId: { name: string; email: string; number: string };
    seatId: { seatNumber: string; price: number; floor: string };
    startDate: string;
    endDate: string;
    status: string;
  };
  payment: Array<{
    _id: string;
    amount: number;
    paymentMode: string;
    durationDays: number;
    receiptNumber: string;
    createdAt: string;
  }>;
}

export default function EditSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { color } = useSelector((state: any) => state.theme);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<SubscriptionDetails | null>(null);

  const [receiptNumber, setReceiptNumber] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [splitPayments, setSplitPayments] = useState<PaymentEntry[]>([
    { amount: 0, paymentMode: "cash" },
  ]);

  const [isNewPayment, setIsNewPayment] = useState(false);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await fetch(`/api/subscription/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
          const payments = result.data.payment;
          if (payments && payments.length > 0) {
            const lastPayment = payments[payments.length - 1];
            const sameReceiptPayments = payments.filter(
              (p: any) => p.receiptNumber === lastPayment.receiptNumber
            );

            setReceiptNumber(lastPayment.receiptNumber);
            setDurationDays(lastPayment.durationDays);
            setSplitPayments(
              sameReceiptPayments.map((p: any) => ({
                _id: p._id,
                amount: p.amount,
                paymentMode: p.paymentMode,
              }))
            );
          }
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

  const handleAddRow = () => {
    setSplitPayments([...splitPayments, { amount: 0, paymentMode: "cash" }]);
  };

  const handleRemoveRow = (index: number) => {
    const newPayments = splitPayments.filter((_, i) => i !== index);
    setSplitPayments(newPayments);
  };

  const handleUpdateRow = (index: number, field: keyof PaymentEntry, value: any) => {
    const newPayments = [...splitPayments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setSplitPayments(newPayments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Total amount must match the seat price for the duration
    if (totalAmount < estimatedAmount) {
      toast.error(`Amount cannot be lower than ₹${estimatedAmount.toLocaleString()}`);
      return;
    }
    if (totalAmount > estimatedAmount) {
      toast.error(`Amount cannot be greater than ₹${estimatedAmount.toLocaleString()}`);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(isNewPayment ? "Adding payment..." : "Updating transaction...");
    try {
      const endpoint = isNewPayment ? "/api/subscription/renew" : `/api/subscription/${id}`;
      const method = isNewPayment ? "POST" : "PUT";

      const body = isNewPayment
        ? { 
            subscriptionId: id, 
            durationDays, 
            paymentMode: splitPayments[0].paymentMode 
          }
        : { 
            subscriptionId: id, 
            updateData: { 
              splitPayments 
            } 
          };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(isNewPayment ? "Payment added!" : "Transaction updated!", { id: loadingToast });
        router.push(`/subscriptions/${id}`);
      } else {
        toast.error(result.message || "Failed to save", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <SimpleLoader text="Loading records..." />;
  if (!data) return <div className="p-8 text-center font-bold text-red-500">Subscription not found</div>;

  const { subscription } = data;
  const totalAmount = splitPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const estimatedAmount = Math.round((subscription.seatId.price / 30) * durationDays);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20 font-public-sans">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Edit Subscription"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: subscription.userId.name, href: `/subscriptions/${id}` },
            { label: "Edit" },
          ]}
          backLink={`/subscriptions/${id}`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Icon icon="solar:armchair-bold-duotone" width={32} height={32} />
              </div>
              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-barlow font-bold text-gray-900">Seat {subscription.seatId.seatNumber}</h2>
                  <span className="text-[11px] font-public-sans font-bold text-gray-600 uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-md">
                    {subscription.status}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-[13px] font-public-sans font-bold text-gray-500 flex items-center gap-2">
                    <Icon icon="solar:user-bold-duotone" width={16} height={16} className="text-indigo-400" />
                    {subscription.userId.name}
                  </p>
                  <p className="text-[11px] font-public-sans font-bold text-gray-400 uppercase tracking-widest">
                    Floor: <span className="text-gray-600">{subscription.seatId.floor || "1st Floor"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-indigo-50/50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Icon icon="solar:refresh-circle-bold-duotone" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {isNewPayment ? "Add New Payment" : "Update Last Transaction"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsNewPayment(!isNewPayment)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        {isNewPayment ? "Edit Last instead?" : "Add New Payment?"}
                      </button>
                    </div>
                    <p className="text-sm font-public-sans text-gray-500">Modify duration and payment details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Receipt Number */}
                  <div className="space-y-2">
                    <label className="block text-[15px] font-public-sans font-bold text-gray-900">Receipt Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={receiptNumber}
                        className="w-full px-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-[15px] font-public-sans text-gray-400 outline-none cursor-not-allowed font-mono"
                        placeholder="RCPT-XXXX"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="block text-[15px] font-public-sans font-bold text-gray-900">Duration (Days)</label>
                    <div className="flex items-stretch rounded-xl border border-gray-200 bg-gray-100 overflow-hidden cursor-not-allowed">
                      <input
                        type="number"
                        value={durationDays}
                        className="flex-1 w-full px-4 py-4 bg-transparent outline-none text-[15px] font-public-sans text-gray-400 font-mono"
                        disabled
                      />
                      <div className="bg-gray-50/80 border-l border-gray-200 px-4 flex items-center justify-center text-[13px] font-public-sans font-bold text-gray-400 uppercase tracking-widest shrink-0">
                        Days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Split UI - Matching Add Page Style */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className="block text-[15px] font-public-sans font-bold text-gray-900">Payment Breakdown</label>
                      <p className="text-[13px] font-public-sans text-gray-500 mt-0.5">Manage split payments for this receipt.</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60">
                    {splitPayments.map((payment, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 w-full">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block px-1">Mode</label>
                          <div className="relative">
                            <select
                              value={payment.paymentMode}
                              onChange={(e) => handleUpdateRow(index, "paymentMode", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all appearance-none"
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
                            onChange={(e) => handleUpdateRow(index, "amount", parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all font-mono"
                          />
                        </div>
                        {splitPayments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            className="p-3 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-all shrink-0"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" width={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 mt-3 border-t border-dashed border-gray-200">
                      <button
                        type="button"
                        onClick={handleAddRow}
                        className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                      >
                        <Icon icon="solar:add-circle-bold" width={18} />
                        Add Payment Row
                      </button>
                      
                      <div className="flex items-center gap-3 bg-amber-100 px-4 py-1">
                         <span className="text-[11px] font-barlow font-semibold text-gray-600 uppercase ">Total Split:</span>
                         <span className={`text-sm font-bold ${
                           totalAmount !== estimatedAmount ? "text-red-500" : "text-emerald-700"
                         }`}>
                           ₹{totalAmount.toLocaleString()} / ₹{estimatedAmount.toLocaleString()}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  fullWidth
                  className="w-full py-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-public-sans font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <Icon icon="solar:check-circle-bold" width={20} height={20} />
                  {isNewPayment ? "Confirm New Payment" : "Update Transaction"}
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
                  <span className="text-gray-500 font-semibold tracking-wide">Seat Number</span>
                  <span className="text-gray-900 font-bold">{subscription.seatId.seatNumber}</span>
                </div>
                
                <div className="flex justify-between items-center font-public-sans text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide">Duration</span>
                  <span className="text-gray-900 font-bold">{durationDays} Days</span>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-end font-public-sans">
                    <span className="text-gray-500 font-semibold tracking-wide text-xs">Total Amount</span>
                    <span className="text-lg font-barlow font-bold text-indigo-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {splitPayments.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Payment Breakdown</p>
                    <div className="space-y-2">
                      {splitPayments.map((p, i) => (
                        <div key={i} className="flex justify-between items-center text-xs font-public-sans px-1">
                          <span className="text-gray-500 font-medium capitalize">{p.paymentMode}</span>
                          <span className="text-gray-900 font-bold font-mono">₹{p.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-100/50 flex gap-4 items-center">
                   <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0">
                      <Icon icon="duo-icons:clock" width={20} height={20} />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[11px] font-public-sans font-bold text-amber-900/60 tracking-wider uppercase">Ends On</p>
                      <p className="text-[15px] font-public-sans font-bold text-amber-900">
                         {(() => {
                            const date = new Date(subscription.startDate);
                            date.setDate(date.getDate() + durationDays);
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
  );
}
