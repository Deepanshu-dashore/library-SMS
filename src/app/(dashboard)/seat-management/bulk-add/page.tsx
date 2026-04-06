"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  ArrowRight, Settings2, IndianRupee, Layers3, X, Save, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

interface BulkSeatRow {
  seatNumber: string;
  price: number;
  type: "normal" | "ac";
  floor: string;
}

export default function BulkAddSeatsPage() {
  const router = useRouter();
  const [step, setStep] = useState<"config" | "preview">("config");
  const [submitting, setSubmitting] = useState(false);
  const [floors, setFloors] = useState<string[]>([]);
  const [config, setConfig] = useState({
    count: 10,
    prefix: "S",
    startFrom: 1,
    defaultPrice: 1500,
    defaultType: "normal" as "normal" | "ac",
    defaultFloor: "",
  });
  const [rows, setRows] = useState<BulkSeatRow[]>([]);

  // Fetch library floors on mount
  useEffect(() => {
    fetch("/api/library/floors")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const list: string[] = data.data?.floors || [];
          setFloors(list);
          if (list.length > 0) setConfig(c => ({ ...c, defaultFloor: list[0] }));
        }
      })
      .catch(() => {});
  }, []);

  const generateRows = () => {
    if (!config.defaultFloor) return toast.error("Please select a floor");
    const generated: BulkSeatRow[] = Array.from({ length: config.count }, (_, i) => ({
      seatNumber: `${config.prefix}${config.startFrom + i}`,
      price: config.defaultPrice,
      type: config.defaultType,
      floor: config.defaultFloor,
    }));
    setRows(generated);
    setStep("preview");
  };

  const updateRow = (index: number, field: keyof BulkSeatRow, value: any) => {
    setRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rows.length === 0) return toast.error("No seats to submit!");
    setSubmitting(true);
    const t = toast.loading(`Registering ${rows.length} seats...`);
    try {
      const res = await fetch("/api/seat/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${rows.length} seats registered!`, { id: t });
        router.push("/seat-management");
      } else {
        toast.error(data.message || "Failed to add seats", { id: t });
      }
    } catch {
      toast.error("An error occurred", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <PageHeader
        title="Bulk Seat Registration"
        backLink="/seat-management"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Seat Management", href: "/seat-management" },
          { label: "Bulk Add" },
        ]}
      />

      {step === "config" ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 ring-1 ring-gray-100">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">01</div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Batch Configuration</h3>
                <p className="text-sm text-gray-500 font-medium">Set your defaults — fine-tune each row individually on the next step.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Seat Count */}
              <div className="bg-gray-50/70 rounded-[24px] p-6 space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Layers3 size={13} /> Total Seat Count
                </label>
                <input
                  type="number"
                  min={1} max={500}
                  value={config.count}
                  onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-3xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                />
              </div>

              {/* Numbering Pattern */}
              <div className="bg-gray-50/70 rounded-[24px] p-6 space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Settings2 size={13} /> Seat Numbering (Prefix + Start)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="S"
                    value={config.prefix}
                    onChange={e => setConfig(c => ({ ...c, prefix: e.target.value.toUpperCase() }))}
                    className="w-20 bg-white border border-gray-200 rounded-2xl px-4 py-4 text-2xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-center"
                  />
                  <input
                    type="number"
                    min={1}
                    value={config.startFrom}
                    onChange={e => setConfig(c => ({ ...c, startFrom: Number(e.target.value) }))}
                    className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-2xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                  />
                </div>
                <p className="text-sm text-gray-400 font-bold pt-1">
                  Preview: <span className="text-gray-600">
                    {config.prefix}{config.startFrom}, {config.prefix}{config.startFrom + 1} … {config.prefix}{config.startFrom + config.count - 1}
                  </span>
                </p>
              </div>

              {/* Default Price */}
              <div className="bg-gray-50/70 rounded-[24px] p-6 space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <IndianRupee size={13} /> Default Monthly Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.defaultPrice}
                  onChange={e => setConfig(c => ({ ...c, defaultPrice: Number(e.target.value) }))}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-3xl font-black text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Default Floor */}
              <div className="bg-gray-50/70 rounded-[24px] p-6 space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Default Floor</label>
                {floors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {floors.map(fl => (
                      <button
                        key={fl}
                        type="button"
                        onClick={() => setConfig(c => ({ ...c, defaultFloor: fl }))}
                        className={`px-5 py-3 rounded-xl font-black transition-all ${
                          config.defaultFloor === fl
                            ? "bg-gray-900 text-white shadow-lg"
                            : "bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. Ground, 1st, 2nd"
                      value={config.defaultFloor}
                      onChange={e => setConfig(c => ({ ...c, defaultFloor: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                    />
                    <p className="text-xs text-amber-600 font-bold">
                      ⚠️ No floors configured. Add them in Settings → Edit Profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Default Type */}
              <div className="bg-gray-50/70 rounded-[24px] p-6 space-y-3 md:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Default Seat Category</label>
                <div className="flex gap-4">
                  {(["normal", "ac"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConfig(c => ({ ...c, defaultType: type }))}
                      className={`flex-1 py-6 rounded-[24px] font-black text-lg transition-all ${
                        config.defaultType === type
                          ? "bg-gray-900 text-white shadow-2xl"
                          : "bg-white border-2 border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {type === "ac" ? "❄️ AC Seat" : "🪑 Normal Seat"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={generateRows}
            disabled={!config.count || !config.prefix || !config.defaultFloor}
            className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-[28px] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 disabled:opacity-40"
          >
            Generate Preview Table <ArrowRight size={28} />
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-100">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg">02</div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Review & Fine-tune</h3>
                  <p className="text-sm text-gray-500 font-medium">{rows.length} seats ready — edit any row, then submit</p>
                </div>
              </div>
              <button
                onClick={() => setStep("config")}
                className="text-sm font-black text-gray-400 hover:text-gray-700 transition-colors px-4 py-2 bg-white border border-gray-200 rounded-xl"
              >
                ← Back
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 w-12">#</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Seat No.</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Price (₹)</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Floor</th>
                    <th className="px-6 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="px-6 py-3 text-gray-300 font-black text-xs">{idx + 1}</td>

                      <td className="px-6 py-3">
                        <input
                          value={row.seatNumber}
                          onChange={e => updateRow(idx, "seatNumber", e.target.value)}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-black text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                        />
                      </td>

                      <td className="px-6 py-3">
                        <input
                          type="number"
                          min={0}
                          value={row.price}
                          onChange={e => updateRow(idx, "price", Number(e.target.value))}
                          className="w-28 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                        />
                      </td>

                      <td className="px-6 py-3">
                        <select
                          value={row.type}
                          onChange={e => updateRow(idx, "type", e.target.value as "normal" | "ac")}
                          className={`bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-black outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all appearance-none cursor-pointer ${
                            row.type === "ac" ? "text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <option value="normal">🪑 Normal</option>
                          <option value="ac">❄️ AC</option>
                        </select>
                      </td>

                      <td className="px-6 py-3">
                        {floors.length > 0 ? (
                          <select
                            value={row.floor}
                            onChange={e => updateRow(idx, "floor", e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all cursor-pointer appearance-none"
                          >
                            {floors.map(fl => (
                              <option key={fl} value={fl}>{fl}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={row.floor}
                            onChange={e => updateRow(idx, "floor", e.target.value)}
                            className="w-28 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                          />
                        )}
                      </td>

                      <td className="px-6 py-3">
                        <button
                          onClick={() => removeRow(idx)}
                          className="p-1.5 text-gray-200 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/seat-management")}
              className="px-10 py-5 bg-white border border-gray-200 text-gray-500 font-bold rounded-[24px] hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rows.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[28px] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              {submitting ? "Registering seats..." : `Register ${rows.length} Seats`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
