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
    seatId: { _id: string, seatNumber: string };
    status: string;
  };
}

interface Seat {
  _id: string;
  seatNumber: string;
  type: string;
  floor?: string;
}

export default function TransferSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { color, darkColor, mode } = useSelector((state: any) => state.theme);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<SubscriptionDetails | null>(null);
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);
  
  const [targetSeatId, setTargetSeatId] = useState("");

  const [selectedFloor, setSelectedFloor] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, seatsRes] = await Promise.all([
          fetch(`/api/subscription/${id}`),
          fetch("/api/seat?status=available&limit=1000")
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

  // Filter and Pagination logic
  const floors = ["All", ...Array.from(new Set(availableSeats.map(s => s.floor).filter(Boolean) as string[]))];
  
  const filteredSeats = selectedFloor === "All" 
    ? availableSeats 
    : availableSeats.filter(s => s.floor === selectedFloor);

  const totalPages = Math.ceil(filteredSeats.length / itemsPerPage);
  const paginatedSeats = filteredSeats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when floor changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFloor]);

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
    <div className={clsx(mode === "dark" ? "bg-transparent" : "bg-gray-50/50", "min-h-screen")}>
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
          <div className={clsx("rounded-xl p-10 border relative overflow-hidden", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none" : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]")}>
            <div className={clsx("absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl", mode === "dark" ? "bg-indigo-950/20" : "bg-indigo-50/50")} />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
               {/* From Seat */}
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className={clsx("w-24 h-24 rounded-2xl flex items-center justify-center border", mode === "dark" ? "bg-slate-900 border-gray-800 text-gray-500" : "bg-gray-50 border-gray-200 text-gray-400")}>
                     <Icon icon="solar:armchair-bold-duotone" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className={clsx("text-[11px] font-public-sans font-bold uppercase tracking-widest mb-1", mode === "dark" ? "text-gray-500" : "text-gray-400")}>Current Seat</h4>
                    <p className={clsx("text-2xl font-barlow font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>Seat {subscription.seatId.seatNumber}</p>
                    <p className={clsx("text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-400" : "text-gray-500")}>{subscription.userId.name}</p>
                  </div>
               </div>

               {/* Arrow */}
               <div className="flex flex-col items-center gap-2">
                  <div className={clsx("w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center", mode === "dark" ? "shadow-none" : "shadow-lg shadow-indigo-100")}>
                     <Icon icon="solar:arrow-right-linear" width={32} height={32} />
                  </div>
                  <span className="text-[10px] font-public-sans font-bold text-indigo-400 uppercase tracking-[0.2em]">Moving To</span>
               </div>

               {/* To Seat Selection */}
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className={clsx(
                    "w-24 h-24 rounded-2xl transition-all flex items-center justify-center shadow-sm border",
                    targetSeatId 
                      ? "bg-indigo-600 text-white border-indigo-600 scale-105" 
                      : (mode === "dark" ? "bg-indigo-950/20 border-indigo-900/40 text-indigo-900/60" : "bg-indigo-50 border-indigo-100/50 text-indigo-200")
                  )}>
                     <Icon icon="solar:armchair-bold-duotone" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className={clsx("text-[11px] font-public-sans font-bold uppercase tracking-widest mb-1", mode === "dark" ? "text-gray-500" : "text-gray-400")}>New Seat</h4>
                    <p className={clsx("text-2xl font-barlow font-bold", targetSeatId ? "text-indigo-600" : (mode === "dark" ? "text-slate-600" : "text-gray-300"))}>
                      {targetSeatId ? `Seat ${availableSeats.find(s => s._id === targetSeatId)?.seatNumber}` : "Select Below"}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none" : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]")}>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Form Header */}
              <div className={clsx("flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                <div className={clsx("w-12 h-12 rounded-xl border flex items-center justify-center shrink-0", mode === "dark" ? "bg-indigo-950/30 border-indigo-900/50 text-indigo-400" : "border-gray-100 text-gray-700")} style={mode === "dark" ? {} : {color,backgroundColor:darkColor+"15"}}>
                  <Icon icon="solar:transfer-horizontal-bold-duotone" width={24} height={24} />
                </div>
                <div>
                  <h3 className={clsx("text-lg font-semibold leading-tight", mode === "dark" ? "text-white" : "text-gray-900")}>Transfer Subscription</h3>
                  <p className={clsx("text-sm font-public-sans", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Pick an available seat to transfer to</p>
                </div>
                <div className={clsx("px-3 py-1 rounded-lg border flex items-center gap-2 sm:ml-auto", mode === "dark" ? "bg-green-950/20 border-green-900/40 text-green-400" : "bg-green-50 border-green-100 text-green-700")}>
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[12px] font-bold uppercase tracking-wider">{availableSeats.length} Available</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Choose Seat</label>
                    <p className={clsx("text-[13px] font-public-sans mt-0.5", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Pick an available seat from the library layout.</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-2">
                  {/* Floor Filter */}
                  <div className="flex flex-wrap gap-2">
                    {floors.map((floor) => (
                      <button
                        key={floor}
                        type="button"
                        onClick={() => setSelectedFloor(floor)}
                        className={clsx(
                          "px-4 py-1.5 rounded-lg capitalize text-sm font-medium transition-all",
                          selectedFloor === floor
                            ? "bg-indigo-600 text-white shadow-md"
                            : (mode === "dark" ? "bg-slate-900 text-gray-400 hover:bg-slate-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                        )}
                      >
                        {floor === "All" ? "All Floors" : floor}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                    {paginatedSeats.length === 0 ? (
                      <p className="col-span-full text-gray-500 text-[13px] font-public-sans font-semibold">No seats available in this section.</p>
                    ) : (
                      paginatedSeats.map((seat) => (
                        <button
                          key={seat._id}
                          type="button"
                          onClick={() => setTargetSeatId(seat._id)}
                          className={clsx(
                            "group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                            targetSeatId === seat._id
                              ? "bg-indigo-600 border-indigo-600 scale-105"
                              : (mode === "dark" ? "bg-slate-900 border-gray-800 hover:border-indigo-900/50 hover:bg-slate-900/80 text-gray-400" : "bg-white cursor-pointer border-gray-100 hover:border-indigo-200 hover:bg-gray-50")
                          )}
                        >
                           <Icon icon={seat.type === "ac" ? "solar:armchair-bold-duotone" : "solar:chair-bold-duotone"} width={26} height={26}
                             className={clsx("transition-colors", 
                               targetSeatId === seat._id ? "text-white" : "text-gray-400 group-hover:text-indigo-400"
                             )} 
                           />
                          <span className={clsx("text-[13px] font-public-sans font-bold", 
                            targetSeatId === seat._id ? "text-white" : (mode === "dark" ? "text-white" : "text-gray-900")
                          )}>{seat.seatNumber}</span>
                          {seat.floor && (
                            <span className={clsx("text-[10px] uppercase tracking-tighter", 
                              targetSeatId === seat._id ? "text-indigo-200" : "text-gray-400"
                            )}>
                              {seat.floor}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>

                   {/* Pagination Buttons */}
                  {totalPages > 1 && (
                    <div className={clsx("flex flex-col sm:flex-row items-center justify-between pt-6 gap-4 border-t", mode === "dark" ? "border-gray-800" : "border-gray-50")}>
                      <p className="text-[13px] font-public-sans text-gray-500">
                        Showing <span className={clsx("font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>{(currentPage - 1) * itemsPerPage + 1}</span> to <span className={clsx("font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>{Math.min(currentPage * itemsPerPage, filteredSeats.length)}</span> of <span className={clsx("font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>{filteredSeats.length}</span> seats
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all shadow-sm",
                            mode === "dark"
                              ? "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <Icon icon="solar:alt-arrow-left-linear" width={18} height={18} />
                          Prev
                        </button>
                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all shadow-sm",
                            mode === "dark"
                              ? "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          Next
                          <Icon icon="solar:alt-arrow-right-linear" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

               <div className={clsx("p-4 rounded-xl border flex gap-4 items-center", mode === "dark" ? "bg-indigo-950/20 border-indigo-900/30 text-indigo-400" : "bg-indigo-50/80 border-indigo-100 text-indigo-600")}>
                 <Icon icon="solar:danger-triangle-bold-duotone" className="text-indigo-600 shrink-0" width={24} height={24} />
                 <p className={clsx("text-[13px] font-public-sans font-bold leading-relaxed", mode === "dark" ? "text-indigo-300" : "text-indigo-900")}>
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
