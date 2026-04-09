"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Armchair, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";

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
  price: number;
}

export default function AddSubscriptionPage() {
  const router = useRouter();
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
        if (seatsData.success) setSeats(seatsData.data);
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
      <div className="max-w-[1000px] mx-auto p-4 md:p-8">
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
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Member Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User size={20} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Select Member</h3>
                  </div>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[15px] font-semibold text-gray-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all appearance-none"
                  >
                    <option value="">Choose a member...</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section 2: Seat Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Armchair size={20} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Choose Seat</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
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
                              : "bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                          }`}
                        >
                          <Armchair 
                            className={`w-6 h-6 transition-colors ${
                              formData.seatId === seat._id ? "text-white" : "text-gray-400 group-hover:text-indigo-400"
                            }`} 
                          />
                          <span className={`text-[13px] font-black ${
                            formData.seatId === seat._id ? "text-white" : "text-gray-900"
                          }`}>
                            {seat.seatNumber}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Section 3: Duration */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <Clock size={20} />
                       </div>
                       <h3 className="text-lg font-black text-gray-900">Duration</h3>
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

                  {/* Section 4: Start Date */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <Calendar size={20} />
                       </div>
                       <h3 className="text-lg font-black text-gray-900">Start Date</h3>
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[15px] font-semibold text-gray-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Section 5: Payment Mode */}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <CheckCircle2 size={24} />
                  Complete Subscription
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-xl font-black text-gray-900 mb-6">Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Seat Price</span>
                  <span className="text-gray-900 font-black">₹{selectedSeat?.price || 0}/mo</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Duration</span>
                  <span className="text-gray-900 font-black">{formData.durationDays} Days</span>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-100">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">Total Amount</span>
                    <span className="text-4xl font-black text-indigo-600">₹{estimatedAmount}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                   <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[12px] font-black text-amber-900 uppercase tracking-tight">Ends On</p>
                      <p className="text-sm font-semibold text-amber-800">
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
