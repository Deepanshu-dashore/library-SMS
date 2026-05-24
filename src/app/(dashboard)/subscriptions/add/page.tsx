"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { useSelector } from "react-redux";
import clsx from "clsx";

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
  floor?: string;
}

export default function AddSubscriptionPage() {
  const router = useRouter();
  const { color, darkColor, mode } = useSelector((state: any) => state.theme);
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

  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState<{ mode: string; amount: number }[]>([]);

  const [selectedFloor, setSelectedFloor] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; // Show 18 seats per set (3x6 or similar)

  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const searchParams = useSearchParams();
  const memberIdParam = searchParams.get("memberId");

  // Handle pre-selected member from query param
  useEffect(() => {
    if (memberIdParam) {
      setFormData(prev => ({ ...prev, userId: memberIdParam }));
    }
  }, [memberIdParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, seatsRes] = await Promise.all([
          fetch("/api/user?status=Active&limit=1000"),
          fetch("/api/seat?status=available&limit=1000")
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

    if (isSplitPayment) {
      const total = splitPayments.reduce((s, p) => s + (p.amount || 0), 0);
      if (total < estimatedAmount) {
        toast.error(`Split payments total must be exactly ₹${estimatedAmount}`);
        return;
      }
      if (total > estimatedAmount) {
        toast.error(`Split payments total must be exactly ₹${estimatedAmount}`);
        return;
      }
      if (total <= 0) {
        toast.error("Please enter a valid payment amount");
        return;
      }
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating subscription...");
    try {
      const payload = {
        ...formData,
        splitPayments: isSplitPayment ? splitPayments : undefined,
        paymentMode: isSplitPayment ? undefined : formData.paymentMode
      };

      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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

  // Filter and Pagination logic
  const floors = ["All", ...Array.from(new Set(seats.map(s => s.floor).filter(Boolean) as string[]))];

  const filteredSeats = selectedFloor === "All"
    ? seats
    : seats.filter(s => s.floor === selectedFloor);

  const totalPages = Math.ceil(filteredSeats.length / itemsPerPage);
  const paginatedSeats = filteredSeats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when floor changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFloor]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    user.number.includes(memberSearch)
  );

  const selectedMember = users.find(u => u._id === formData.userId);

  return (
    <div className={clsx(mode === "dark" ? "bg-transparent" : "bg-gray-50/50", "min-h-screen")}>
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
            <div className={clsx("rounded-xl p-8 md:p-10 border", mode === "dark" ? "bg-[#1c252e] border-gray-800 shadow-none" : "bg-white border-gray-100/80 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]")}>
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Form Header */}
                <div className={clsx("flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                  <div className={clsx("w-12 h-12 rounded-xl border flex items-center justify-center shrink-0", mode === "dark" ? "bg-indigo-950/30 border-indigo-900/50 text-indigo-400" : "border-gray-100 text-gray-700")} style={mode === "dark" ? {} : { color, backgroundColor: darkColor + "15" }}>
                    <Icon icon="solar:bill-list-bold-duotone" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className={clsx("text-lg font-semibold leading-tight", mode === "dark" ? "text-white" : "text-gray-900")}>Configure Subscription</h3>
                    <p className={clsx("text-sm font-public-sans", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Select a member, seat, and duration to proceed</p>
                  </div>
                </div>                {/* Section 1: Member Selection (Searchable) */}
                <div className="space-y-2 relative">
                  <div>
                    <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Member</label>
                    <p className={clsx("text-[13px] font-public-sans mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Search and select an active member account.</p>
                  </div>

                  <div className="relative group">
                    <div
                      onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                      className={clsx(
                        "w-full px-4 py-4 border rounded-xl text-[15px] font-public-sans outline-none transition-all cursor-pointer flex items-center justify-between",
                        mode === "dark"
                          ? "bg-slate-900 text-gray-300"
                          : "bg-white text-gray-900",
                        showMemberDropdown
                          ? "border-indigo-600 ring-1 ring-indigo-600"
                          : (mode === "dark" ? "border-gray-800 hover:border-gray-700" : "border-gray-300/60 hover:border-gray-400")
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:user-circle-bold-duotone" width={22} height={22} className={selectedMember ? "text-indigo-600" : "text-gray-400"} />
                        <span className={selectedMember ? clsx("font-medium", mode === "dark" ? "text-white" : "text-gray-900") : "text-gray-400"}>
                          {selectedMember ? `${selectedMember.name} (${selectedMember.number})` : "Choose a member..."}
                        </span>
                      </div>
                      <Icon icon={showMemberDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} width={20} height={20} className="text-gray-500" />
                    </div>

                    {showMemberDropdown && (
                      <div className={clsx("absolute z-50 left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in slide-in-from-top-2 duration-200", mode === "dark" ? "bg-[#1c252e] border-gray-800" : "bg-white border-gray-200")}>
                        <div className={clsx("p-3 border-b", mode === "dark" ? "bg-slate-950/40 border-gray-800" : "bg-gray-50/50 border-gray-100")}>
                          <div className="relative">
                            <Icon icon="solar:magnifer-linear" width={18} height={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Search by name or number..."
                              value={memberSearch}
                              onChange={(e) => setMemberSearch(e.target.value)}
                              className={clsx("w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all border", mode === "dark" ? "bg-slate-900 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900")}
                            />
                          </div>
                        </div>

                        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                          {filteredUsers.length === 0 ? (
                            <div className="p-8 text-center">
                              <Icon icon="solar:user-block-outline" width={40} height={40} className="mx-auto text-gray-300 mb-2" />
                              <p className="text-sm text-gray-500 font-medium">No members found</p>
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <div
                                key={user._id}
                                onClick={() => {
                                  setFormData({ ...formData, userId: user._id });
                                  setShowMemberDropdown(false);
                                  setMemberSearch("");
                                }}
                                className={clsx(
                                  "px-4 py-2 border-t border-dashed cursor-pointer transition-colors flex items-center justify-between group/item",
                                  mode === "dark" ? "border-gray-800 hover:bg-indigo-950/20" : "border-gray-200 hover:bg-indigo-50",
                                  formData.userId === user._id && (mode === "dark" ? "bg-indigo-950/40" : "bg-indigo-50/50")
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={clsx("w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold",
                                    formData.userId === user._id
                                      ? "bg-indigo-600 text-gray-50"
                                      : (mode === "dark" ? "bg-slate-800 text-gray-400 group-hover/item:bg-indigo-900 group-hover/item:text-indigo-200" : "bg-gray-100 text-gray-500 group-hover/item:bg-indigo-100 group-hover/item:text-indigo-600")
                                  )}>
                                    {user.name.charAt(0)}
                                  </div>
                                  <div className="flex gap-2">
                                    <p className={clsx("text-[14px] capitalize font-semibold", formData.userId === user._id ? "text-indigo-500" : (mode === "dark" ? "text-gray-200" : "text-gray-900"))}>{user.name}</p>
                                    <p className={clsx("text-[12px] font-barlow font-semibold", mode === "dark" ? "text-gray-400" : "text-gray-600")}>({user.number})</p>
                                  </div>
                                </div>
                                {formData.userId === user._id && (
                                  <Icon icon="solar:check-circle-bold" width={20} height={20} className="text-indigo-600" />
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1.5 px-1 mt-1">
                    <Icon icon="solar:info-circle-bold-duotone" width={14} className="shrink-0" />
                    Only verified members with an active status are shown in this list.
                  </p>
                </div>

                {/* Section 2: Seat Selection */}
                <div className="space-y-2 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Choose Seat</label>
                      <p className={clsx("text-[13px] font-public-sans mt-0.5", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Pick an available seat from the library layout.</p>
                    </div>
                    <div className={clsx("px-3 py-1 rounded-lg border flex items-center gap-2", mode === "dark" ? "bg-green-950/20 border-green-900/40 text-green-400" : "bg-green-50 border-green-100 text-green-700")}>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[12px] font-bold uppercase tracking-wider">{seats.length} Available</span>
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
                        <p className="col-span-full text-gray-500 text-sm font-medium">No seats available in this section.</p>
                      ) : (
                        paginatedSeats.map((seat) => (
                          <button
                            key={seat._id}
                            type="button"
                            onClick={() => setFormData({ ...formData, seatId: seat._id })}
                            className={clsx(
                              "group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                              formData.seatId === seat._id
                                ? "bg-indigo-600 border-indigo-600 scale-105"
                                : (mode === "dark" ? "bg-slate-900 border-gray-800 hover:border-indigo-900/50 hover:bg-slate-900/80 text-gray-400" : "bg-white cursor-pointer border-gray-100 hover:border-indigo-200 hover:bg-gray-50")
                            )}
                          >
                            <Icon icon={seat.type === "ac" ? "solar:armchair-bold-duotone" : "solar:chair-bold-duotone"} width={26} height={26}
                              className={clsx("transition-colors",
                                formData.seatId === seat._id ? "text-white" : "text-gray-400 group-hover:text-indigo-400"
                              )}
                            />
                            <span className={clsx("text-[13px] font-public-sans font-bold",
                              formData.seatId === seat._id ? "text-white" : (mode === "dark" ? "text-white" : "text-gray-900")
                            )}>
                              {seat.seatNumber}
                            </span>
                            {seat.floor && (
                              <span className={clsx("text-[10px] uppercase tracking-tighter",
                                formData.seatId === seat._id ? "text-indigo-200" : "text-gray-400"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Section 3: Duration */}
                  <div className="space-y-2">
                    <div>
                      <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Duration</label>
                      <p className={clsx("text-[13px] font-public-sans mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Number of days to subscribe.</p>
                    </div>
                    <div className={clsx("flex items-stretch rounded-xl border transition-all overflow-hidden", mode === "dark" ? "border-gray-800 bg-slate-900 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-700" : "bg-white border-gray-300/60 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 hover:border-gray-400")}>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.durationDays}
                        onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                        className={clsx("flex-1 w-full px-4 py-4 bg-transparent outline-none text-[15px] font-public-sans font-mono", mode === "dark" ? "text-white" : "text-gray-900")}
                      />
                      <div className={clsx("border-l px-4 flex items-center justify-center text-[13px] font-public-sans font-bold uppercase tracking-widest shrink-0", mode === "dark" ? "bg-slate-950/40 border-gray-800 text-slate-500" : "bg-gray-50/80 border-gray-300/80 text-gray-500")}>
                        Days
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Start Date */}
                  <div className="space-y-2">
                    <div>
                      <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Start Date</label>
                      <p className={clsx("text-[13px] font-public-sans mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>When does this cycle begin?</p>
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={clsx("w-full px-4 py-4 border rounded-xl text-[15px] font-public-sans outline-none transition-all cursor-pointer", mode === "dark" ? "bg-slate-900 border-gray-800 text-white focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600" : "bg-white border-gray-300/60 text-gray-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 hover:border-gray-400")}
                    />
                  </div>
                </div>

                {/* Section 5: Payment Mode */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className={clsx("block text-[15px] font-public-sans font-bold", mode === "dark" ? "text-gray-200" : "text-gray-900")}>Payment Details</label>
                      <p className={clsx("text-[13px] font-public-sans mt-0.5 mb-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Select payment mode or split between multiple modes.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSplitPayment(!isSplitPayment);
                        if (!isSplitPayment && splitPayments.length === 0) {
                          setSplitPayments([{ mode: "cash", amount: estimatedAmount }]);
                        }
                      }}
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
                          <span className={`text-sm font-bold ${splitPayments.reduce((s, p) => s + p.amount, 0) !== estimatedAmount ? "text-red-500" : "text-emerald-700"
                            }`}>
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
                  Continue
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
                  <span className={clsx("font-semibold tracking-wide", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Seat Price</span>
                  <span className={clsx("font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>₹{selectedSeat?.price || 0}/mo</span>
                </div>

                <div className="flex justify-between items-center font-public-sans text-sm">
                  <span className={clsx("font-semibold tracking-wide", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Duration</span>
                  <span className={clsx("font-bold", mode === "dark" ? "text-white" : "text-gray-900")}>{formData.durationDays} Days</span>
                </div>

                <div className={clsx("pt-6 border-t border-dashed", mode === "dark" ? "border-gray-800" : "border-gray-200")}>
                  <div className="flex justify-between items-end font-public-sans">
                    <span className={clsx("font-semibold tracking-wide text-xs", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Total Amount</span>
                    <span className="text-lg font-barlow font-bold text-indigo-600">₹{estimatedAmount}</span>
                  </div>
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

                <div className={clsx("p-2 rounded-xl border flex gap-4 items-center", mode === "dark" ? "bg-amber-950/20 border-amber-900/30" : "bg-amber-50/80 border-amber-100/50")}>
                  <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", mode === "dark" ? "bg-amber-950/50 text-amber-400" : "bg-amber-100/90 text-amber-600")}>
                    <Icon icon="duo-icons:clock" width={20} height={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-public-sans font-bold text-amber-900/60 tracking-wider uppercase">Ends On</p>
                    <p className={clsx("text-[15px] font-public-sans font-bold", mode === "dark" ? "text-amber-400" : "text-amber-900")}>
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
