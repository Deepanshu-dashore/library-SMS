"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { useSelector } from "react-redux";

interface Member {
  _id: string;
  name: string;
  email: string;
  number: string;
}

interface Seat {
  _id: string;
  seatNumber: string;
  status: string;
  type: string;
  price: number;
}

export default function AddSubscriptionPage() {
  const router = useRouter();
  const {color,darkColor} = useSelector((state: any) => state.theme);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Member[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  
  const [formData, setFormData] = useState({
    userId: "",
    seatId: "",
    durationDays: 30,
    startDate: new Date().toISOString().split("T")[0],
    paymentMode: "cash"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, seatsRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/seat?status=available")
        ]);
        
        const usersData = await usersRes.json();
        const seatsData = await seatsRes.json();
        
        if (usersData.success) setUsers(usersData.data.users);
        if (seatsData.success) setSeats(seatsData.data.seats || seatsData.data);
      } catch (error) {
        toast.error("Failed to load users and seats");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.seatId) {
      toast.error("Please select both a member and a seat");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating subscription...");
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Subscription created successfully!", { id: loadingToast });
        router.push("/subscriptions");
      } else {
        toast.error(data.message || "Failed to create subscription", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const selectedSeat = seats.find(s => s._id === formData.seatId);
  const estimatedAmount = selectedSeat ? Math.round((selectedSeat.price / 30) * formData.durationDays) : 0;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl">
        <PageHeader 
          title="Add New Subscription"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Add" }
          ]}
          backLink="/subscriptions"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Form Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                  <div style={{color,backgroundColor:darkColor+"15"}} className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                    <Icon icon="solar:bill-list-bold-duotone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">Configure Subscription</h3>
                    <p className="text-sm font-public-sans text-gray-500">Select a member, seat, and duration to proceed</p>
                  </div>
                </div>

                {/* Section 1: Member Selection */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[15px] font-public-sans font-bold text-gray-900">Member</label>
                    <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Search and select an active member account.</p>
                  </div>
                  <div className="relative">
                    <select
                      required
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300/60 rounded-xl text-[15px] font-public-sans text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Choose a member...</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.number})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <Icon icon="solar:alt-arrow-down-linear" width={20} height={20} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Seat Selection */}
                <div className="space-y-2 pt-2">
                  <div>
                    <label className="block text-[15px] font-public-sans font-bold text-gray-900">Choose Seat</label>
                    <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Pick an available seat from the library layout.</p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                    {seats.length === 0 ? (
                      <p className="col-span-full text-gray-500 text-sm font-medium">No seats available at the moment.</p>
                    ) : (
                      seats.map((seat) => (
                        <button
                          key={seat._id}
                          type="button"
                          onClick={() => setFormData({ ...formData, seatId: seat._id })}
                          className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                            formData.seatId === seat._id
                              ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 scale-105"
                              : "bg-white cursor-pointer border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                          }`}
                        >
                          <Icon icon={seat.type === "ac" ? "solar:armchair-bold-duotone" : "solar:chair-bold-duotone"} width={26} height={26}
                            className={`transition-colors ${
                              formData.seatId === seat._id ? "text-white" : "text-gray-400 group-hover:text-indigo-400"
                            }`} 
                          />
                          <span className={`text-[13px] font-public-sans font-bold ${
                            formData.seatId === seat._id ? "text-white" : "text-gray-900"
                          }`}>
                            {seat.seatNumber}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Section 3: Duration */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[15px] font-public-sans font-bold text-gray-900">Duration</label>
                      <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Number of days to subscribe.</p>
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

                  {/* Section 4: Start Date */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[15px] font-public-sans font-bold text-gray-900">Start Date</label>
                      <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">When does this cycle begin?</p>
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300/60 rounded-xl text-[15px] font-public-sans text-gray-900 outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Section 5: Payment Mode */}
                <div className="space-y-2 pt-2">
                  <div>
                    <label className="block text-[15px] font-public-sans font-bold text-gray-900">Payment Mode</label>
                    <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Select how the user paid for this subscription.</p>
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
                  Continue
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
                  <span className="text-gray-500 font-semibold tracking-wide">Seat Price</span>
                  <span className="text-gray-900 font-bold">₹{selectedSeat?.price || 0}/mo</span>
                </div>
                
                <div className="flex justify-between items-center font-public-sans text-sm">
                  <span className="text-gray-500 font-semibold tracking-wide">Duration</span>
                  <span className="text-gray-900 font-bold">{formData.durationDays} Days</span>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-end font-public-sans">
                    <span className="text-gray-500 font-semibold tracking-wide text-xs">Total Amount</span>
                    <span className="text-lg font-barlow font-bold text-indigo-600">₹{estimatedAmount}</span>
                  </div>
                </div>

                <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-100/50 flex gap-4 items-center">
                   <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0">
                      <Icon icon="duo-icons:clock" width={20} height={20} />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[11px] font-public-sans font-bold text-amber-900/60 tracking-wider uppercase">Ends On</p>
                      <p className="text-[15px] font-public-sans font-bold text-amber-900">
                         {(() => {
                            const date = new Date(formData.startDate);
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
  );
}
