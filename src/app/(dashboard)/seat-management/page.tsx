"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Database, Grid, List, Edit3, Trash2, Layers
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import Table from "@/components/shared/Table";

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
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters
  const [floorFilter, setFloorFilter] = useState(FLOOR_ALL);
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL);
  const [typeFilter, setTypeFilter] = useState(TYPE_ALL);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seat");
      const data = await res.json();
      if (data.success) setSeats(data.data);
      else toast.error("Failed to load seats.");
    } catch {
      toast.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSeats(); }, []);

  const handleDelete = async (seat: Seat) => {
    if (!confirm(`Confirm deletion of ${seat.seatNumber}?`)) return;
    const t = toast.loading("Deleting seat...");
    try {
      const res = await fetch(`/api/seat/soft-delete/${seat._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Seat deleted", { id: t }); fetchSeats(); }
      else toast.error(data.message, { id: t });
    } catch {
      toast.error("An error occurred", { id: t });
    }
  };

  // Compute unique floors from data
  const floors = [FLOOR_ALL, ...Array.from(new Set(seats.map(s => s.floor).filter(Boolean))).sort()];

  // Apply all filters
  const filteredSeats = seats.filter(s => {
    const matchFloor = floorFilter === FLOOR_ALL || s.floor === floorFilter;
    const matchStatus = statusFilter === STATUS_ALL || (s.status || "available") === statusFilter;
    const matchType = typeFilter === TYPE_ALL || s.type === typeFilter;
    return matchFloor && matchStatus && matchType;
  });


  // ── filter pill helpers ──────────────────────────────────────────────────────
  function FilterPills({
    label, options, value, onChange,
  }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 shrink-0">{label}:</span>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all ${
              value === opt
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

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
              <button
                onClick={() => setViewMode(v => v === "grid" ? "table" : "grid")}
                className="p-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                title={viewMode === "grid" ? "Table View" : "Grid View"}
              >
                {viewMode === "grid" ? <List size={20} /> : <Grid size={20} />}
              </button>
              <button
                onClick={() => toast.promise(fetchSeats(), { loading: "Refreshing...", success: "Synced", error: "Error" })}
                className="p-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                title="Refresh"
              >
                <Database size={20} />
              </button>
              <button
                onClick={() => router.push("/seat-management/add")}
                className="bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2 hover:bg-gray-50 shadow-sm"
              >
                <Plus size={18} /> Add Seat
              </button>
              <button
                onClick={() => router.push("/seat-management/bulk-add")}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center gap-2"
              >
                <Layers size={18} /> Bulk Add
              </button>
            </div>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Seats",  value: seats.length,                                        color: "text-gray-900" },
            { label: "Available",    value: seats.filter(s => (s.status || "available") === "available").length, color: "text-green-600" },
            { label: "Occupied",     value: seats.filter(s => s.status === "occupied").length,   color: "text-red-500"  },
            { label: "AC Seats",     value: seats.filter(s => s.type === "ac").length,           color: "text-blue-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              <h4 className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</h4>
            </div>
          ))}
        </div>

        {/* ── Filter Bar ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm px-6 py-4 mb-8 flex flex-wrap gap-x-8 gap-y-4 items-center">
          <FilterPills
            label="Floor"
            options={floors}
            value={floorFilter}
            onChange={setFloorFilter}
          />
          <div className="h-5 w-px bg-gray-100 hidden md:block" />
          <FilterPills
            label="Status"
            options={[STATUS_ALL, "available", "occupied", "maintenance"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="h-5 w-px bg-gray-100 hidden md:block" />
          <FilterPills
            label="Type"
            options={[TYPE_ALL, "normal", "ac"]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          {(floorFilter !== FLOOR_ALL || statusFilter !== STATUS_ALL || typeFilter !== TYPE_ALL) && (
            <button
              onClick={() => { setFloorFilter(FLOOR_ALL); setStatusFilter(STATUS_ALL); setTypeFilter(TYPE_ALL); }}
              className="ml-auto text-xs font-black text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-4">
          Showing {filteredSeats.length} of {seats.length} seats
        </p>

        {/* Grid / Table */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 animate-in fade-in duration-500">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white rounded-[28px] border-2 border-dashed border-gray-100 animate-pulse" />
                ))
              : filteredSeats.length === 0
              ? <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">No seats match the selected filters.</div>
              : filteredSeats.map(seat => (
                  <div
                    key={seat._id}
                    className="group bg-white rounded-[28px] p-5 shadow-sm border-2 border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all flex flex-col items-center justify-center relative overflow-hidden aspect-square"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 ${seat.type === "ac" ? "bg-blue-500" : "bg-gray-200"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 mt-2 ${seat.type === "ac" ? "text-blue-400" : "text-gray-300"}`}>
                      {seat.type}
                    </span>
                    <h5 className="text-2xl font-black text-gray-900 tracking-tighter select-none">{seat.seatNumber}</h5>
                    <p className="text-emerald-500 font-black text-xs mt-0.5">₹{seat.price}</p>
                    <p className="text-[9px] font-bold text-gray-300 mt-0.5">{seat.floor}</p>

                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => router.push(`/seat-management/${seat._id}/edit`)}
                        className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(seat)}
                        className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full ring-4 ${
                      seat.status === "occupied"     ? "bg-red-400 ring-red-50"
                      : seat.status === "maintenance" ? "bg-amber-400 ring-amber-50"
                      : "bg-green-500 ring-green-50"
                    }`} />
                  </div>
                ))}
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
