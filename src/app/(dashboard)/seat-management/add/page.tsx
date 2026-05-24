"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import clsx from "clsx";

export default function AddSeatPage() {
  const router = useRouter();
  const { mode } = useSelector((state: any) => state.theme);
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
      .catch(() => { });
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

      <form onSubmit={handleSubmit} className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={clsx(
          "rounded-xl p-8 md:p-10 border space-y-8",
          mode === "dark"
            ? "bg-[#1c252e] border-gray-800 shadow-none ring-0"
            : "bg-white border-gray-100 shadow-sm ring-1 ring-gray-100"
        )}>

          {/* Seat Number */}
          <div className="space-y-2">
            <label className={clsx("text-[12px] mb-1.5 inline-block font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Seat Number *</label>
            <input
              required
              type="text"
              placeholder="e.g. S1, A3, AC12"
              value={form.seatNumber}
              onChange={e => setForm(f => ({ ...f, seatNumber: e.target.value.toUpperCase() }))}
              className={clsx(
                "w-full text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                mode === "dark"
                  ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
              )}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className={clsx("text-[12px] mb-1.5 inline-block font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Monthly Price (₹) *</label>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className={clsx(
                "w-full text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                mode === "dark"
                  ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
              )}
            />
          </div>

          {/* Floor */}
          <div className="space-y-2">
            <label className={clsx("text-[12px] mb-1.5 inline-block font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Floor *</label>
            {floors.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {floors.map(fl => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, floor: fl }))}
                    className={clsx(
                      "px-5 capitalize py-2.5 rounded-lg text-sm font-bold transition-all border",
                      form.floor === fl
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : (mode === "dark"
                          ? "bg-slate-900 text-gray-400 border-gray-800 hover:border-gray-700 cursor-pointer"
                          : "bg-gray-50 cursor-pointer border-gray-200 text-gray-500 hover:border-gray-300"
                        )
                    )}
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
                  className={clsx(
                    "w-full text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                    mode === "dark"
                      ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                  )}
                />
                <p className="text-xs text-amber-600 font-bold pl-2">
                  ⚠️ No floors configured yet. Go to Settings → Edit Profile to add floors.
                </p>
              </div>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className={clsx("text-[12px] mb-1.5 inline-block font-bold uppercase tracking-wider", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Seat Category *</label>
            <div className="grid grid-cols-2 gap-4">
              {(["normal", "ac"] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={clsx(
                    "py-3 rounded-lg text-sm font-bold transition-all border",
                    form.type === type
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : (mode === "dark"
                        ? "bg-slate-900 text-gray-400 border-gray-800 hover:border-gray-700 cursor-pointer"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 cursor-pointer"
                      )
                  )}
                >
                  {type === "ac" ? "AC Seat" : "Normal Seat"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={clsx("flex justify-end gap-4 pt-4 border-t", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/seat-management")}
            className={clsx(
              "px-8 py-3 rounded-lg text-sm font-bold border",
              mode === "dark"
                ? "border-gray-800 text-gray-300 hover:bg-slate-800 bg-transparent"
                : "border-gray-300/70 bg-white"
            )}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={submitting}
            icon="mingcute:save-fill"
            className={clsx(
              "px-8 py-3 rounded-lg text-sm font-bold text-white shadow-md",
              mode === "dark" ? "bg-indigo-600 hover:bg-indigo-700 shadow-none border-indigo-600" : "bg-gray-800 hover:bg-indigo-700"
            )}
            color={mode === "dark" ? undefined : "#1e2939"}
            hoverColor={mode === "dark" ? undefined : "#1e2960"}
          >
            {submitting ? "Adding..." : "Add Seat"}
          </Button>
        </div>
      </form>
    </div >
  );
}
