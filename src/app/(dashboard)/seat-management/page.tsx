"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Database,
  Grid,
  List,
  Edit3,
  Trash2,
  Layers,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import Table from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import SlidingDropDown from "@/components/shared/SlidingDropDown";

interface Seat {
  _id: string;
  seatNumber: string;
  price: number;
  type: "normal" | "ac";
  floor: string;
  status?: string; // 'available' | 'occupied' | 'maintenance'
}

const FLOOR_ALL = "All";
const STATUS_ALL = "All";
const TYPE_ALL = "All";

export default function SeatManagement() {
  const router = useRouter();
  // allSeats = unfiltered, used for stats + unique floor list
  const [allSeats, setAllSeats] = useState<Seat[]>([]);
  // filteredSeats = result from backend with active filters applied
  const [filteredSeats, setFilteredSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters
  const [floorFilter, setFloorFilter] = useState(FLOOR_ALL);
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL);
  const [typeFilter, setTypeFilter] = useState(TYPE_ALL);

  // Fetch all seats (no filters) — for stats row + floor pill options
  const fetchAllSeats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seat");
      const data = await res.json();
      if (data.success) {
        setAllSeats(data.data);
        setFilteredSeats(data.data); // initialise display with full list
      } else toast.error("Failed to load seats.");
    } catch {
      toast.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch from backend with query params whenever filters change
  const fetchFiltered = async (floor: string, status: string, type: string) => {
    setFilterLoading(true);
    try {
      const params = new URLSearchParams();
      if (floor !== FLOOR_ALL) params.set("floor", floor);
      if (status !== STATUS_ALL) params.set("status", status);
      if (type !== TYPE_ALL) params.set("type", type);
      const res = await fetch(`/api/seat?${params.toString()}`);
      const data = await res.json();
      if (data.success) setFilteredSeats(data.data);
      else toast.error("Failed to filter seats.");
    } catch {
      toast.error("Internal Server Error");
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSeats();
  }, []);

  // Re-fetch filtered list whenever a filter changes
  useEffect(() => {
    fetchFiltered(floorFilter, statusFilter, typeFilter);
  }, [floorFilter, statusFilter, typeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (seat: Seat) => {
    if (!confirm(`Confirm deletion of ${seat.seatNumber}?`)) return;
    const t = toast.loading("Deleting seat...");
    try {
      const res = await fetch(`/api/seat/soft-delete/${seat._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Seat deleted", { id: t });
        fetchAllSeats();
        fetchFiltered(floorFilter, statusFilter, typeFilter);
      } else toast.error(data.message, { id: t });
    } catch {
      toast.error("An error occurred", { id: t });
    }
  };

  // Unique floor options come from the full unfiltered set
  const floors = [
    FLOOR_ALL,
    ...Array.from(new Set(allSeats.map((s) => s.floor).filter(Boolean))).sort(),
  ];

  // Alias for stats row
  const seats = allSeats;



  const seatStatusStyles = [
    {
      status: "available",
      label: "Available",
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    {
      status: "occupied",
      label: "Occupied",
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
    },
    {
      status: "maintenance",
      label: "Maintenance",
      bg: "bg-amber-600/30",
      text: "text-amber-600",
      border: "border-amber-200",
    },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="">
        <PageHeader
          title="Seat Management"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Inventory" },
          ]}
          actionNode={
            <div className="flex gap-3">
              <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      : "text-gray-400 cursor-pointer hover:text-gray-600"
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                  <span className="text-xs font-bold">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    viewMode === "table"
                      ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      : "text-gray-400 cursor-pointer hover:text-gray-600"
                  }`}
                  title="Table View"
                >
                  <List size={16} />
                  <span className="text-xs font-bold">Table</span>
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.promise(fetchAllSeats(), {
                    loading: "Refreshing...",
                    success: "Synced",
                    error: "Error",
                  })
                }
                title="Refresh"
              >
                <Database size={18} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/seat-management/add")}
              >
                <Plus size={18} /> Add Seat
              </Button>
              <Button
                variant="primary"
                size="sm"
                color="#111827"
                onClick={() => router.push("/seat-management/bulk-add")}
              >
                <Layers size={18} /> Bulk Add
              </Button>
            </div>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Seats",
              value: seats.length,
              color: "text-amber-500",
              bg: "bg-[#fcdc69]",
              icon: ({className}: {className: string}) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
	<path fill="currentColor" d="M17.179 21H6.82c-.745 0-1.21 0-1.571-.042v1.291a.75.75 0 0 1-1.5 0v-1.865a4 4 0 0 1-1.656-2.494C2 17.45 2 16.92 2 15.857v-4.611C2 10.006 2.943 9 4.105 9c1.163 0 2.106 1.005 2.106 2.246v3.087c0 .943 0 1.415.292 1.707c.293.293.765.293 1.708.293h7.579c.942 0 1.414 0 1.707-.293c.293-.292.293-.764.293-1.707v-3.087c0-1.24.942-2.246 2.105-2.246C21.057 9 22 10.005 22 11.246v4.611c0 1.063 0 1.594-.094 2.033a4 4 0 0 1-1.656 2.494v1.866a.75.75 0 0 1-1.5 0v-1.292c-.36.042-.826.042-1.571.042"></path>
	<path fill="currentColor" d="M6 8.154V17h12V8.154c0-2.3 0-3.451-.482-4.308A3.65 3.65 0 0 0 16.2 2.495C15.365 2 14.243 2 12 2s-3.365 0-4.2.495a3.65 3.65 0 0 0-1.318 1.351C6 4.703 6 5.853 6 8.154" opacity={0.5}></path>
</svg>
              )
            },
            {
              label: "Available",
              value: seats.filter(
                (s) => (s.status || "available") === "available",
              ).length,
              color: "text-emerald-700",
              bg: "bg-[#1bc794]",
              icon: ({className}: {className: string}) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
	<path fill="currentColor" d="M10.565 2.075c-.394.189-.755.497-1.26.928l-.079.066a2.56 2.56 0 0 1-1.58.655l-.102.008c-.662.053-1.135.09-1.547.236a3.33 3.33 0 0 0-2.03 2.029c-.145.412-.182.885-.235 1.547l-.008.102a2.56 2.56 0 0 1-.655 1.58l-.066.078c-.431.506-.74.867-.928 1.261a3.33 3.33 0 0 0 0 2.87c.189.394.497.755.928 1.26l.066.079c.41.48.604.939.655 1.58l.008.102c.053.662.09 1.135.236 1.547a3.33 3.33 0 0 0 2.029 2.03c.412.145.885.182 1.547.235l.102.008c.629.05 1.09.238 1.58.655l.079.066c.505.431.866.74 1.26.928a3.33 3.33 0 0 0 2.87 0c.394-.189.755-.497 1.26-.928l.079-.066c.48-.41.939-.604 1.58-.655l.102-.008c.662-.053 1.135-.09 1.547-.236a3.33 3.33 0 0 0 2.03-2.029c.145-.412.182-.885.235-1.547l.008-.102c.05-.629.238-1.09.655-1.58l.066-.079c.431-.505.74-.866.928-1.26a3.33 3.33 0 0 0 0-2.87c-.189-.394-.497-.755-.928-1.26l-.066-.079a2.56 2.56 0 0 1-.655-1.58l-.008-.102c-.053-.662-.09-1.135-.236-1.547a3.33 3.33 0 0 0-2.029-2.03c-.412-.145-.885-.182-1.547-.235l-.102-.008a2.56 2.56 0 0 1-1.58-.655l-.079-.066c-.505-.431-.866-.74-1.26-.928a3.33 3.33 0 0 0-2.87 0m5.208 6.617a.75.75 0 0 1 .168 1.047l-3.597 4.981a1.75 1.75 0 0 1-2.736.128l-1.506-1.72a.75.75 0 1 1 1.13-.989l1.505 1.721a.25.25 0 0 0 .39-.018l3.598-4.981a.75.75 0 0 1 1.048-.169"></path>
</svg>
              )
            },
            {
              label: "Occupied",
              value: seats.filter((s) => s.status === "occupied").length,
              color: "text-orange-600",
              bg: "bg-[#fe885b]",
              icon: ({className}: {className: string}) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
	<path fill="currentColor" d="M5 12V3H3v9c0 2.76 2.24 5 5 5h6v-2H8c-1.66 0-3-1.34-3-3m15.5 6H19v-7c0-1.1-.9-2-2-2h-5V3H6v8c0 1.65 1.35 3 3 3h7v7h4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5"></path>
</svg>
              )
            },
            {
              label: "AC Seats",
              value: seats.filter((s) => s.type === "ac").length,
              color: "text-blue-400",
              bg: "bg-[#98dffa]",
              icon: ({className}: {className: string}) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
	<path fill="currentColor" d="M21 11h-3.17l2.54-2.54a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0L15 11h-2V9l3.95-3.95c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0L13 6.17V3c0-.55-.45-1-1-1s-1 .45-1 1v3.17L8.46 3.63a.996.996 0 0 0-1.41 0c-.39.39-.39 1.03 0 1.42L11 9v2H9L5.05 7.05c-.39-.39-1.03-.39-1.42 0a.996.996 0 0 0 0 1.41L6.17 11H3c-.55 0-1 .45-1 1s.45 1 1 1h3.17l-2.54 2.54a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.42 0L9 13h2v2l-3.95 3.95c-.39.39-.39 1.03 0 1.42s1.02.39 1.41 0L11 17.83V21c0 .55.45 1 1 1s1-.45 1-1v-3.17l2.54 2.54c.39.39 1.02.39 1.41 0s.39-1.03 0-1.42L13 15v-2h2l3.95 3.95c.39.39 1.03.39 1.42 0a.996.996 0 0 0 0-1.41L17.83 13H21c.55 0 1-.45 1-1s-.45-1-1-1"></path>
</svg>
              )
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={` ${stat.bg} flex justify-between items-center rounded-md p-5 shadow-sm ${stat.bg}`}
            >
              <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                {stat.label}
              </p>
              <h4 className={`text-3xl font-black mt-1 text-gray-900`}>
                {stat.value}
              </h4>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                  <stat.icon className={`w-14 h-14 ${stat.color}`} />
                </p>
                </div>
            </div>
          ))}
        </div>

        {/* ── Filter Bar ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-6 py-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative z-20">
          <SlidingDropDown
            name="floor-filter"
            label="Floor"
            options={floors}
            selected={floorFilter !== FLOOR_ALL ? [floorFilter] : []}
            onSelect={(vals: string[]) => setFloorFilter(vals[0] || FLOOR_ALL)}
            multiple={false}
          />
          <SlidingDropDown
            name="status-filter"
            label="Status"
            options={[STATUS_ALL, "available", "occupied", "maintenance"]}
            selected={statusFilter !== STATUS_ALL ? [statusFilter] : []}
            onSelect={(vals: string[]) => setStatusFilter(vals[0] || STATUS_ALL)}
            multiple={false}
          />
          <SlidingDropDown
            name="type-filter"
            label="Type"
            options={[TYPE_ALL, "normal", "ac"]}
            selected={typeFilter !== TYPE_ALL ? [typeFilter] : []}
            onSelect={(vals: string[]) => setTypeFilter(vals[0] || TYPE_ALL)}
            multiple={false}
          />
          {(floorFilter !== FLOOR_ALL ||
            statusFilter !== STATUS_ALL ||
            typeFilter !== TYPE_ALL) && (
            <div className="col-span-full flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
              <span className="text-[13px] font-semibold text-gray-400 mr-2">Filters applied:</span>

              {floorFilter !== FLOOR_ALL && (
                <div className="flex items-center gap-2 border border-gray-200 border-dashed rounded-xl px-2.5 py-1.5 bg-white">
                  <span className="text-[13px] font-bold text-gray-800">Floor:</span>
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-lg">
                    {floorFilter}
                    <button onClick={() => setFloorFilter(FLOOR_ALL)} className="bg-gray-400 cursor-pointer hover:bg-gray-500 text-white rounded-full p-0.5 transition-colors">
                      <X size={10} strokeWidth={4} />
                    </button>
                  </span>
                </div>
              )}

              {statusFilter !== STATUS_ALL && (
                <div className="flex items-center gap-2 border border-gray-200 border-dashed rounded-xl px-2.5 py-1.5 bg-white">
                  <span className="text-[13px] font-bold text-gray-800">Status:</span>
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-lg capitalize">
                    {statusFilter}
                    <button onClick={() => setStatusFilter(STATUS_ALL)} className="bg-gray-400 cursor-pointer hover:bg-gray-500 text-white rounded-full p-0.5 transition-colors">
                      <X size={10} strokeWidth={4} />
                    </button>
                  </span>
                </div>
              )}

              {typeFilter !== TYPE_ALL && (
                <div className="flex items-center gap-2 border border-gray-200 border-dashed rounded-xl px-2.5 py-1.5 bg-white">
                  <span className="text-[13px] font-bold text-gray-800">Type:</span>
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-lg capitalize">
                    {typeFilter}
                    <button onClick={() => setTypeFilter(TYPE_ALL)} className="bg-gray-400 cursor-pointer hover:bg-gray-500 text-white rounded-full p-0.5 transition-colors">
                      <X size={10} strokeWidth={4} />
                    </button>
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  setFloorFilter(FLOOR_ALL);
                  setStatusFilter(STATUS_ALL);
                  setTypeFilter(TYPE_ALL);
                }}
                className="flex cursor-pointer items-center justify-center gap-1.5 text-[13.5px] font-bold text-red-600 hover:text-red-700 transition-colors ml-2"
              >
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M9.425 11.482c.413-.044.78.273.821.707l.5 5.263c.041.433-.26.82-.671.864c-.412.043-.78-.273-.821-.707l-.5-5.263c-.041-.434.26-.821.671-.864m5.15 0c.412.043.713.43.671.864l-.5 5.263c-.04.434-.408.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.041-.433.409-.75.82-.707"
                          clipRule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886"
                          opacity={0.5}
                        ></path>
                      </svg>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Grid / Table */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 animate-in fade-in duration-500">
            {loading || filterLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-white rounded-[28px] border-2 border-dashed border-gray-100 animate-pulse"
                />
              ))
            ) : filteredSeats.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">
                No seats match the selected filters.
              </div>
            ) : (
              filteredSeats.map((seat) => (
                <div
                  key={seat._id}
                  className="group bg-white rounded-lg p-4 shadow-sm border-2 border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-200 flex flex-col relative overflow-hidden"
                >
                  {/* header row: icon + seat number */}
                  <div className="flex relative items-center justify-between mt-2">
                    <div
                      className={`p-2 rounded-2xl border mx-auto ${(seatStatusStyles.find((s) => s.status === (seat.status || "available")) ?? seatStatusStyles[0]).bg} ${(seatStatusStyles.find((s) => s.status === (seat.status || "available")) ?? seatStatusStyles[0]).text} ${(seatStatusStyles.find((s) => s.status === (seat.status || "available")) ?? seatStatusStyles[0]).border}`}
                    >
                      {seat.type === "ac" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M17.179 21H6.82c-.745 0-1.21 0-1.571-.042v1.291a.75.75 0 0 1-1.5 0v-1.865a4 4 0 0 1-1.656-2.494C2 17.45 2 16.92 2 15.857v-4.611C2 10.006 2.943 9 4.105 9c1.163 0 2.106 1.005 2.106 2.246v3.087c0 .943 0 1.415.292 1.707c.293.293.765.293 1.708.293h7.579c.942 0 1.414 0 1.707-.293c.293-.292.293-.764.293-1.707v-3.087c0-1.24.942-2.246 2.105-2.246C21.057 9 22 10.005 22 11.246v4.611c0 1.063 0 1.594-.094 2.033a4 4 0 0 1-1.656 2.494v1.866a.75.75 0 0 1-1.5 0v-1.292c-.36.042-.826.042-1.571.042"
                          />
                          <path
                            fill="currentColor"
                            d="M6 8.154V17h12V8.154c0-2.3 0-3.451-.482-4.308A3.65 3.65 0 0 0 16.2 2.495C15.365 2 14.243 2 12 2s-3.365 0-4.2.495a3.65 3.65 0 0 0-1.318 1.351C6 4.703 6 5.853 6 8.154"
                            opacity={0.5}
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5.25 15.5c0-.966.784-1.75 1.75-1.75h10c.966 0 1.75.784 1.75 1.75A2.75 2.75 0 0 1 16 18.25H8a2.75 2.75 0 0 1-2.75-2.75m1.378-8.734c.242-2.012.362-3.017.944-3.704a3 3 0 0 1 .638-.566C8.96 2 9.974 2 12 2s3.039 0 3.79.496a3 3 0 0 1 .638.566c.582.687.703 1.692.944 3.704l.091.757c.25 2.088.376 3.132-.221 3.804c-.597.673-1.648.673-3.75.673h-2.983c-2.103 0-3.154 0-3.75-.673c-.597-.672-.472-1.716-.222-3.804z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M2 10.75a.75.75 0 0 0 0 1.5c.827 0 1.29.092 1.574.218c.249.11.41.265.581.547c.03.05.043.071.056.096c.013.024.031.058.063.127c.05.11.075.18.15.404l.864 2.595a.8.8 0 0 0 .147.256a2.7 2.7 0 0 1-.185-.993c0-.646.35-1.21.87-1.513l-.28-.837a5 5 0 0 0-.205-.543a3 3 0 0 0-.198-.371c-.285-.469-.656-.876-1.258-1.14c-.566-.25-1.274-.346-2.179-.346m10.75 3h-1.5V12h1.5zm5.815 2.743a2.7 2.7 0 0 0 .185-.993c0-.646-.35-1.21-.87-1.513l.28-.837a5 5 0 0 1 .205-.543c.086-.185.13-.258.198-.371c.285-.469.657-.876 1.258-1.14c.566-.25 1.274-.346 2.179-.346a.75.75 0 0 1 0 1.5c-.827 0-1.29.092-1.574.218c-.249.11-.41.265-.581.547c-.03.05-.043.071-.056.096a2 2 0 0 0-.063.127c-.05.11-.075.18-.15.404l-.864 2.595a.8.8 0 0 1-.147.256M11.25 18.25h1.5v1.166a3.63 3.63 0 0 1 2.461 2.347a.75.75 0 0 1-1.422.474a2.13 2.13 0 0 0-1.039-1.216V22a.75.75 0 0 1-1.5 0v-.98a2.13 2.13 0 0 0-1.039 1.217a.75.75 0 0 1-1.423-.474a3.63 3.63 0 0 1 2.462-2.347z"
                            opacity={0.5}
                          ></path>
                        </svg>
                      )}
                    </div>
                    <div
                      title={seat.type === "ac" ? "AC Seat" : "Non-AC Seat"}
                      className={`h-4 w-4 opacity-45 absolute right-5 top-0 border-4 rounded-full ${seat.type === "ac" ? "bg-blue-400 border-blue-600/70" : "bg-gray-500 border-gray-200/50"}`}
                    />
                  </div>

                  {/* seat number + meta */}
                  <div className="mt-3 text-center">
                    <h5 className="text-xl font-bold text-gray-800 tracking-tight leading-none">
                      {seat.seatNumber}
                    </h5>
                    <p className="mt-1.5 text-[10px] text-gray-400 font-medium flex items-center justify-center w-full">
                      ₹{seat.price}{" "}
                      <span className="inline-block h-3 border-l border-dashed border-gray-300 mx-2"></span>{" "}
                      F - {seat.floor || "G"}
                    </p>
                  </div>

                  {/* hover actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-[28px] opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={() =>
                        router.push(`/seat-management/${seat._id}/edit`)
                      }
                      className="p-1.5 cursor-pointer bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-400 hover:border-blue-100 shadow-sm transition-colors"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" fillRule="evenodd">
                          <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                          <path
                            fill="currentColor"
                            d="m14.535 12.225l4.242 4.243l-4.243 4.243a1 1 0 0 1-.707.293H11a1 1 0 0 1-1-1v-2.829a1 1 0 0 1 .293-.707zM17 2a2 2 0 0 1 1.995 1.85L19 4v4.02a5 5 0 0 0-4.27 1.192l-.196.185l-5.656 5.657a3 3 0 0 0-.872 1.923l-.007.198v2.829a3 3 0 0 0 .11.804l.06.192H5a2 2 0 0 1-1.995-1.85L3 19V4a2 2 0 0 1 1.85-1.995L5 2zm3.191 8.811a3 3 0 0 1 0 4.243L15.95 10.81a3 3 0 0 1 4.242 0ZM11 6H7a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2"
                          ></path>
                        </g>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(seat)}
                      className="p-1.5 cursor-pointer bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 shadow-sm transition-colors"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M9.425 11.482c.413-.044.78.273.821.707l.5 5.263c.041.433-.26.82-.671.864c-.412.043-.78-.273-.821-.707l-.5-5.263c-.041-.434.26-.821.671-.864m5.15 0c.412.043.713.43.671.864l-.5 5.263c-.04.434-.408.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.041-.433.409-.75.82-.707"
                          clipRule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886"
                          opacity={0.5}
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <Table
            headers={["Seat", "Price", "Category", "Floor", "Status"]}
            dataKeys={["seatNumber", "price", "type", "floor", "status"]}
            Data={filteredSeats}
            hasStatus="status"
            isLoading={loading}
            onEdit={(r: any) => router.push(`/seat-management/${r._id}/edit`)}
            onDelete={handleDelete}
            hiddenActions={["view"]}
          />
        )}
      </div>
    </div>
  );
}
