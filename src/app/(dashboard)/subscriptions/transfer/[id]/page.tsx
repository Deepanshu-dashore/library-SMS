"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowRightLeft, 
  Armchair, 
  User, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";

interface SubscriptionDetails {
  subscription: {
    _id: string;
    userId: { name: string, email: string };
    seatId: { _id: string, seatNumber: string };
    status: string;
  };
}

interface Seat {
  _id: string;
  seatNumber: string;
}

export default function TransferSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<SubscriptionDetails | null>(null);
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);
  
  const [targetSeatId, setTargetSeatId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, seatsRes] = await Promise.all([
          fetch(`/api/subscription/${id}`),
          fetch("/api/seat?status=available")
        ]);
        
        const subResult = await subRes.json();
        const seatsResult = await seatsRes.json();
        
        if (subResult.success) setData(subResult.data);
        if (seatsResult.success) setAvailableSeats(seatsResult.data);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSeatId) {
      toast.error("Please select a new seat");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Transferring subscription...");
    try {
      const res = await fetch("/api/subscription/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: id,
          fromSeatId: data?.subscription.seatId._id,
          toSeatId: targetSeatId
        })
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Subscription transferred successfully!", { id: loadingToast });
        router.push("/subscriptions");
      } else {
        toast.error(result.message || "Failed to transfer", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center font-bold text-gray-400">Loading details...</div>;
  if (!data) return <div className="p-8 text-center font-bold text-red-500">Subscription not found</div>;

  const { subscription } = data;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-[900px] mx-auto p-4 md:p-8">
        <PageHeader 
          title="Transfer Subscription"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Transfer" }
          ]}
          backLink="/subscriptions"
        />

        <div className="grid grid-cols-1 gap-8">
          {/* Transfer Visualization */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
               {/* From Seat */}
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-24 h-24 rounded-[32px] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 shadow-inner">
                     <Armchair size={48} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Seat</h4>
                    <p className="text-2xl font-black text-gray-900">Seat {subscription.seatId.seatNumber}</p>
                    <p className="text-sm font-bold text-gray-500">{subscription.userId.name}</p>
                  </div>
               </div>

               {/* Arrow */}
               <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 animate-pulse">
                     <ArrowRightLeft size={32} />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Moving To</span>
               </div>

               {/* To Seat Selection */}
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`w-24 h-24 rounded-[32px] transition-all flex items-center justify-center shadow-lg ${
                    targetSeatId ? "bg-indigo-600 text-white rotate-6 scale-110" : "bg-indigo-50 text-indigo-200"
                  }`}>
                     <Armchair size={48} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">New Seat</h4>
                    <p className={`text-2xl font-black ${targetSeatId ? "text-indigo-600" : "text-gray-300"}`}>
                      {targetSeatId ? `Seat ${availableSeats.find(s => s._id === targetSeatId)?.seatNumber}` : "Select Below"}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                     <Armchair size={20} />
                   </div>
                   <h3 className="text-lg font-black text-gray-900">Select Available Seat</h3>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {availableSeats.length === 0 ? (
                    <p className="col-span-full text-gray-500 text-sm font-medium">No other seats available.</p>
                  ) : (
                    availableSeats.map((seat) => (
                      <button
                        key={seat._id}
                        type="button"
                        onClick={() => setTargetSeatId(seat._id)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          targetSeatId === seat._id
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                            : "bg-white border-gray-100 hover:border-indigo-200"
                        }`}
                      >
                        <span className="text-[13px] font-black">{seat.seatNumber}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex gap-4 items-start">
                 <AlertTriangle className="text-indigo-600 shrink-0" size={24} />
                 <p className="text-sm font-semibold text-indigo-900 leading-relaxed">
                   Transferring a subscription will move the member to the new seat immediately. 
                   The old seat (Seat {subscription.seatId.seatNumber}) will become available for others.
                 </p>
              </div>

              <button
                type="submit"
                disabled={loading || !targetSeatId}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <CheckCircle2 size={24} />
                Transfer Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
