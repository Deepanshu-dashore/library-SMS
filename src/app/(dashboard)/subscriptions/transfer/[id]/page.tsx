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
    seatId: { _id: string, seatNumber: string };
    status: string;
  };
}

interface Seat {
  _id: string;
  seatNumber: string;
  type: string;
}

export default function TransferSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { color, darkColor } = useSelector((state: any) => state.theme);
  
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
        if (seatsResult.success) setAvailableSeats(seatsResult.data?.seats || seatsResult.data);
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
      <div className="max-w-4xl mx-auto p-4 md:p-8">
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
          <div className="bg-white rounded-xl p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
               {/* From Seat */}
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                     <Icon icon="solar:armchair-bold-duotone" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-public-sans font-bold text-gray-400 uppercase tracking-widest mb-1">Current Seat</h4>
                    <p className="text-2xl font-barlow font-bold text-gray-900">Seat {subscription.seatId.seatNumber}</p>
                    <p className="text-[15px] font-public-sans font-bold text-gray-500">{subscription.userId.name}</p>
                  </div>
               </div>

               {/* Arrow */}
               <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                     <Icon icon="solar:arrow-right-linear" width={32} height={32} />
                  </div>
                  <span className="text-[10px] font-public-sans font-bold text-indigo-400 uppercase tracking-[0.2em]">Moving To</span>
               </div>

               {/* To Seat Selection */}
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`w-24 h-24 rounded-2xl transition-all flex items-center justify-center shadow-sm border ${
                    targetSeatId ? "bg-indigo-600 text-white border-indigo-600 scale-105" : "bg-indigo-50 border-indigo-100/50 text-indigo-200"
                  }`}>
                     <Icon icon="solar:armchair-bold-duotone" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-public-sans font-bold text-gray-400 uppercase tracking-widest mb-1">New Seat</h4>
                    <p className={`text-2xl font-barlow font-bold ${targetSeatId ? "text-indigo-600" : "text-gray-300"}`}>
                      {targetSeatId ? `Seat ${availableSeats.find(s => s._id === targetSeatId)?.seatNumber}` : "Select Below"}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] border border-gray-100/80">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                <div style={{color,backgroundColor:darkColor+"15"}} className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                  <Icon icon="solar:transfer-horizontal-bold-duotone" width={24} height={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">Transfer Subscription</h3>
                  <p className="text-sm font-public-sans text-gray-500">Pick an available seat to transfer to</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <label className="block text-[15px] font-public-sans font-bold text-gray-900">Choose Seat</label>
                  <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Pick an available seat from the library layout.</p>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-1">
                  {availableSeats.length === 0 ? (
                    <p className="col-span-full text-gray-500 text-[13px] font-public-sans font-semibold">No other seats available.</p>
                  ) : (
                    availableSeats.map((seat) => (
                      <button
                        key={seat._id}
                        type="button"
                        onClick={() => setTargetSeatId(seat._id)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          targetSeatId === seat._id
                            ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 scale-105"
                            : "bg-white cursor-pointer border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                        }`}
                      >
                         <Icon icon={seat.type === "ac" ? "solar:armchair-bold-duotone" : "solar:chair-bold-duotone"} width={26} height={26}
                           className={`transition-colors ${
                             targetSeatId === seat._id ? "text-white" : "text-gray-400 group-hover:text-indigo-400"
                           }`} 
                         />
                        <span className={`text-[13px] font-public-sans font-bold ${
                          targetSeatId === seat._id ? "text-white" : "text-gray-900"
                        }`}>{seat.seatNumber}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 flex gap-4 items-center">
                 <Icon icon="solar:danger-triangle-bold-duotone" className="text-indigo-600 shrink-0" width={24} height={24} />
                 <p className="text-[13px] font-public-sans font-bold text-indigo-900 leading-relaxed">
                   Transferring a subscription will move the member to the new seat immediately. 
                   The old seat (Seat {subscription.seatId.seatNumber}) will become available for others.
                 </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !targetSeatId}
                className="w-full py-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-public-sans font-bold text-[16px] transition-all flex items-center justify-center gap-2"
              >
                <Icon icon="solar:check-circle-bold" width={20} height={20} />
                Transfer Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
