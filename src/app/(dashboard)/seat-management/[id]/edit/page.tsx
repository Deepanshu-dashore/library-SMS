"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/shared/Button";

export default function EditSeatPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [floors, setFloors] = useState<string[]>([]);
  const [form, setForm] = useState({
    seatNumber: "",
    price: 0,
    type: "normal" as "normal" | "ac",
    floor: "",
    status: "available" as "available" | "occupied" | "maintenance",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [seatRes, floorsRes] = await Promise.all([
          fetch(`/api/seat/${id}`),
          fetch("/api/library/floors"),
        ]);
        const seatData = await seatRes.json();
        const floorsData = await floorsRes.json();

        if (seatData.success) {
          const s = seatData.data;
          setForm({
            seatNumber: s.seatNumber,
            price: s.price,
            type: s.type,
            floor: s.floor,
            status: s.status || "available",
          });
        } else {
          toast.error("Seat not found");
          router.push("/seat-management");
        }

        if (floorsData.success) {
          setFloors(floorsData.data?.floors || []);
        }
      } catch {
        toast.error("Failed to load seat data");
        router.push("/seat-management");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const t = toast.loading("Saving changes...");
    try {
      const res = await fetch(`/api/seat/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Seat updated!", { id: t });
        router.push("/seat-management");
      } else {
        toast.error(data.message || "Update failed", { id: t });
      }
    } catch {
      toast.error("An error occurred", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <PageHeader
        title="Edit Seat"
        backLink="/seat-management"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Seat Management", href: "/seat-management" },
          { label: form.seatNumber || "Edit" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100 space-y-8">
      
                {/* Seat Number */}
                <div className="space-y-2">
                  <label className="text-[12px] mb-1.5 inline-block font-bold text-gray-500 uppercase tracking-wider">Seat Number *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. S1, A3, AC12"
                    value={form.seatNumber}
                    onChange={e => setForm(f => ({ ...f, seatNumber: e.target.value.toUpperCase() }))}
                    className="w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  />
                </div>
      
                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[12px] mb-1.5 inline-block font-bold text-gray-500 uppercase tracking-wider">Monthly Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  />
                </div>
      
                {/* Floor */}
                <div className="space-y-2">
                  <label className="text-[12px] mb-1.5 inline-block font-bold text-gray-500 uppercase tracking-wider">Floor *</label>
                  {floors.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {floors.map(fl => (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, floor: fl }))}
                          className={`px-5 capitalize py-2.5 rounded-lg text-sm font-bold transition-all ${
                            form.floor === fl
                              ? "bg-indigo-600 text-white shadow-md border-indigo-600"
                              : "bg-gray-50 cursor-pointer border border-gray-200 text-gray-500 hover:border-gray-300"
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
                        className="w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                      />
                      <p className="text-xs text-amber-600 font-bold pl-2">
                        ⚠️ No floors configured yet. Go to Settings → Edit Profile to add floors.
                      </p>
                    </div>
                  )}
                </div>
      
                {/* Type */}
                <div className="space-y-2">
                  <label className="text-[12px] mb-1.5 inline-block font-bold text-gray-500 uppercase tracking-wider">Seat Category *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(["normal", "ac"] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, type }))}
                        className={`py-3 rounded-lg text-sm font-bold transition-all ${
                          form.type === type
                            ? "bg-indigo-600 text-white shadow-md border-indigo-600"
                            : "bg-gray-50 border border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {type === "ac" ? "AC Seat" : "Normal Seat"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
      
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/seat-management")}
                  className="px-8 py-3 rounded-lg text-sm font-bold border-gray-300/70 bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={submitting}
                  icon="solar:armchair-bold"
                  iconPosition="right"
                  className="px-8 py-3 rounded-lg text-sm font-bold bg-gray-800 hover:bg-indigo-700 text-white shadow-md"
                  color="#1e2939"
                  hoverColor="#101828"
                >
                  {submitting ? "Adding..." : "Add Seat"}
                </Button>
              </div>
            </form>
    </div>
  );
}
