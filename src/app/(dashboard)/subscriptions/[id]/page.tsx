"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { useSelector } from "react-redux";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { motion } from "framer-motion";

interface SubscriptionDetails {
  subscription: {
    _id: string;
    userId: { name: string; email: string; number: string };
    seatId: { seatNumber: string; price: number; floor: string };
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
    _id: string;
  }>;
}

export default function ViewSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { color } = useSelector((state: any) => state.theme);
  const themeColor = color || "#2563EB";
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
      } catch {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400">Fetching records...</p>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm font-bold text-red-500">Record not found</p>
      </div>
    );

  const { subscription, payment } = data;
  const today = new Date();
  const startDate = new Date(subscription.startDate);
  const endDate = new Date(subscription.endDate);
  const isExpired = endDate < today && subscription.status === "active";
  const statusKey =
    subscription.status === "cancelled"
      ? "cancelled"
      : isExpired
      ? "expired"
      : subscription.status;

  // Progress calculation
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = totalDays > 0 ? Math.min(100, Math.round(((totalDays - daysRemaining) / totalDays) * 100)) : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Subscription Details"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: subscription.userId.name },
          ]}
          backLink="/subscriptions"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 space-y-5">

            {/* Member Details */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-gray-900">Member Details</h3>
                <StatusBadge status={statusKey} size="xs" />
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: "Full Name", value: subscription.userId.name },
                  { label: "Email", value: subscription.userId.email },
                  { label: "Phone", value: subscription.userId.number },
                ].map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-12 gap-2 px-6 py-3.5 items-center">
                    <p className="col-span-4 text-sm text-gray-800 font-medium">{label}</p>
                    <p className="col-span-8 text-sm capitalize font-medium text-gray-500">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white border border-gray-100 rounded-xl  overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-[15px] font-barlow font-bold text-gray-900">Transaction History</h3>
                <Link
                  href="/payments"
                  className="inline-flex items-center gap-1 text-gray-600 text-sm font-semibold hover:underline"
                >
                  View All
                  <Icon icon="mingcute:right-line" className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100/80 border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Receipt Number</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payment.length > 0 ? (
                      payment.map((pay, i) => (
                        <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-600 uppercase">{pay.receiptNumber}</td>
                          <td className="px-6 py-4 font-medium text-gray-600">
                            {new Date(pay.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-600">₹{pay.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/payments/${pay._id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-200/70 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all">
                              <Icon icon="mdi:invoice-text" className="w-4 h-4" />
                              Receipt
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium text-sm">
                          No transactions recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subscription Progress */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-[15px] font-barlow font-bold text-gray-900">Subscription Progress</h3>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-800">Subscription Progress</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{daysRemaining} Days Remaining</p>
                </div>
                <span
                  className="text-sm font-black tabular-nums"
                  style={{ color: themeColor }}
                >
                  {progressPercent}%
                </span>
              </div>

              {/* Segmented bar */}
              <div className="flex gap-1">
                {Array.from({ length: 30 }).map((_, i) => {
                  const filled = i < Math.round((progressPercent / 100) * 20);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scaleY: 0.5 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.03, ease: "easeOut" }}
                      className="flex-1 h-3 rounded-xs"
                      style={{
                        backgroundColor: filled ? themeColor : "#e5e7eb",
                        boxShadow: filled ? `0 0 4px ${themeColor}55` : "none",
                      }}
                    />
                  );
                })}
              </div>

              {/* Start / End labels */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-semibold text-gray-400">
                  {startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  {endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Seat & Duration */}
            <div className="bg-white border border-gray-100 rounded-xl  p-6 space-y-5">
              {/* Seat */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon icon="solar:chair-bold-duotone" width={24} height={24} />
                </div>
                <div>
                  <p className="text-base font-black text-gray-900">Seat {subscription.seatId.seatNumber}</p>
                  <p className="text-xs font-bold text-blue-500">{subscription.seatId.floor}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-100" />

              {/* Duration */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="solar:calendar-date-bold-duotone" width={18} height={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">
                    {startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    {" – "}
                    {endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">1 Month Duration</p>
                </div>
              </div>

              {/* Created On */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="solar:clock-circle-bold-duotone" width={18} height={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">Created On</p>
                  <p className="text-[13px] font-bold text-gray-900 mt-0.5">
                    {new Date(subscription.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan & Price */}
            <div className="bg-white border border-gray-100 rounded-xl  p-6">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-gray-900">Standard Plan</p>
                <StatusBadge status={statusKey} size="xs" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-black text-gray-900 tracking-tight leading-none">
                  ₹{subscription.seatId.price.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-gray-400 ml-1">/ per month</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push(`/subscriptions/${id}/edit`)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Icon icon="solar:pen-new-square-linear" className="w-4 h-4" />
                  Edit Details
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-500 bg-white border border-red-100 hover:bg-red-50 transition-all shadow-sm">
                  <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
                  Cancel Subscription
                </button>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold tracking-wide hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md">
                Renew Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
