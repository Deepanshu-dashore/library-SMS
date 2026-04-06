"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AddSeatPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [floors, setFloors] = useState<string[]>([]);
  const [form, setForm] = useState({
    seatNumber: "",
    price: 1500,
    type: "normal" as "normal" | "ac",
    floor: "",
  });

  useEffect(() => {
    fetch("/api/library/floors")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const list: string[] = data.data?.floors || [];
          setFloors(list);
          if (list.length > 0) setForm(f => ({ ...f, floor: list[0] }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.floor) return toast.error("Please select a floor");
    setSubmitting(true);
    const t = toast.loading("Adding seat...");
    try {
      const res = await fetch("/api/seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Seat added successfully!", { id: t });
        router.push("/seat-management");
      } else {
        toast.error(data.message || "Failed to add seat", { id: t });
      }
    } catch {
      toast.error("An error occurred", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <PageHeader
        title="Add New Seat"
        backLink="/seat-management"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Seat Management", href: "/seat-management" },
          { label: "Add Seat" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100 space-y-8">

          {/* Seat Number */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Seat Number *</label>
            <input
              required
              type="text"
              placeholder="e.g. S1, A3, AC12"
              value={form.seatNumber}
              onChange={e => setForm(f => ({ ...f, seatNumber: e.target.value.toUpperCase() }))}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-2xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all tracking-wider"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Monthly Price (₹) *</label>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-2xl font-black text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Floor */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Floor *</label>
            {floors.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {floors.map(fl => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, floor: fl }))}
                    className={`px-6 py-3 rounded-2xl font-black transition-all ${
                      form.floor === fl
                        ? "bg-gray-900 text-white shadow-xl"
                        : "bg-gray-50 border-2 border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  required
                  type="text"
                  placeholder="e.g. Ground, 1st, 2nd"
                  value={form.floor}
                  onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                />
                <p className="text-xs text-amber-600 font-bold pl-2">
                  ⚠️ No floors configured yet. Go to Settings → Edit Profile to add floors.
                </p>
              </div>
            )}
          </div>

          {/* Type */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Seat Category *</label>
            <div className="grid grid-cols-2 gap-4">
              {(["normal", "ac"] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={`py-6 rounded-[20px] font-black text-lg transition-all ${
                    form.type === type
                      ? "bg-gray-900 text-white shadow-2xl"
                      : "bg-gray-50 border-2 border-gray-200 text-gray-400 hover:border-gray-400"
                  }`}
                >
                  {type === "ac" ? "❄️ AC Seat" : "🪑 Normal Seat"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/seat-management")}
            className="px-10 py-5 bg-white border border-gray-200 text-gray-500 font-bold rounded-[24px] hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-gray-900 hover:bg-black text-white py-5 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
            {submitting ? "Adding..." : "Add Seat"}
          </button>
        </div>
      </form>
    </div>
  );
}
