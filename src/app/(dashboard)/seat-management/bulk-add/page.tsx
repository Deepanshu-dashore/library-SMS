"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import {
  ArrowRight, Settings2, IndianRupee, Layers3, X,
  ChevronLeft
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
        let msg = data.message || "Failed to add seats";
        if (msg.includes("E11000") && msg.includes("dup key")) {
          const match = msg.match(/"([^"]+)"/);
          msg = match ? `Seat number '${match[1]}' already exists!` : "One or more seat numbers already exist.";
        }
        toast.error(msg, { id: t });
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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-gray-100 ring-1 ring-gray-100">
            <div className="flex p-2 rounded-sm items-center gap-4 mb-16 bg-gray-100">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center font-black text-lg">01</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Batch Configuration</h3>
                <p className="text-xs text-gray-500 font-medium">Set your defaults — fine-tune each row individually on the next step.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seat Count */}
              <div className="space-y-2">
                <label className="text-[12px] mb-1.5 font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Layers3 size={14} /> Total Seat Count
                </label>
                <input
                  type="number"
                  min={1} max={500}
                  value={config.count}
                  onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}
                  className="w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                />
              </div>

              {/* Numbering Pattern */}
              <div className="space-y-2">
                <label className="text-[12px] mb-1.5 font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Settings2 size={14} /> Seat Numbering (Prefix + Start)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="S"
                    value={config.prefix}
                    onChange={e => setConfig(c => ({ ...c, prefix: e.target.value.toUpperCase() }))}
                    className="w-20 text-center text-sm px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  />
                  <input
                    type="number"
                    min={1}
                    value={config.startFrom}
                    onChange={e => setConfig(c => ({ ...c, startFrom: Number(e.target.value) }))}
                    className="flex-1 text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 font-bold pt-1">
                  Preview: <span className="text-gray-600">
                    {config.prefix}{config.startFrom}, {config.prefix}{config.startFrom + 1} … {config.prefix}{config.startFrom + config.count - 1}
                  </span>
                </p>
              </div>

              {/* Default Price */}
              <div className="space-y-2">
                <label className="text-[12px] mb-1.5 font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <IndianRupee size={14} /> Default Monthly Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.defaultPrice}
                  onChange={e => setConfig(c => ({ ...c, defaultPrice: Number(e.target.value) }))}
                  className="w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                />
              </div>

              {/* Default Floor */}
              <div className="space-y-2">
                <label className="text-[12px] mb-1.5 font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">Default Floor</label>
                {floors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {floors.map(fl => (
                      <button
                        key={fl}
                        type="button"
                        onClick={() => setConfig(c => ({ ...c, defaultFloor: fl }))}
                        className={`px-5 capitalize py-2.5 rounded-lg text-sm font-bold transition-all ${
                          config.defaultFloor === fl
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
                      type="text"
                      placeholder="e.g. Ground, 1st, 2nd"
                      value={config.defaultFloor}
                      onChange={e => setConfig(c => ({ ...c, defaultFloor: e.target.value }))}
                      className="w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                    />
                    <p className="text-xs text-amber-600 font-bold">
                      ⚠️ No floors configured. Add them in Settings → Edit Profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Default Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[12px] mb-1.5 font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">Default Seat Category</label>
                <div className="relative flex p-1 bg-gray-100 rounded-lg w-full border border-gray-200/60 sm:max-w-md">
                  <div
                    className="absolute top-1 bottom-1 left-1 bg-white rounded-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out"
                    style={{
                      width: 'calc(50% - 4px)',
                      transform: config.defaultType === 'normal' ? 'translateX(0)' : 'translateX(100%)'
                    }}
                  />
                  {(["normal", "ac"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConfig(c => ({ ...c, defaultType: type }))}
                      className={`relative flex-1 py-2.5 text-sm font-bold rounded-md transition-colors z-10 ${
                        config.defaultType === type ? "bg-indigo-600 text-white" : "bg-gray-100 cursor-pointer hover:bg-gray-200"
                      }`}
                    >
                      {type === "ac" ? "AC Seat" : "Normal Seat"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
              <Button
                onClick={generateRows}
                disabled={!config.count || !config.prefix || !config.defaultFloor}
                className="px-8 py-3 rounded-lg text-sm font-bold bg-gray-800 hover:bg-indigo-700 text-white shadow-md flex items-center gap-2"
                color="#1e2939"
                hoverColor="#1e2960"
              >
                Generate Preview Table <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-100">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex bg-gray-100 p-2 rounded-sm  items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-lg">02</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Review & Fine-tune</h3>
                  <p className="text-xs text-gray-500 font-medium">{rows.length} seats ready — edit any row, then submit</p>
                </div>
              </div>
              <button
                onClick={() => setStep("config")}
                className="text-sm flex items-center gap-2 cursor-pointer font-semibold text-gray-400 hover:text-gray-700 transition-colors px-4 py-2 bg-white border border-gray-200 rounded-xl"
              >
                <ChevronLeft size={18} /> Prev Step
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-gray-400 w-12 border-x border-gray-100">#</th>
                    <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-gray-400 border-r border-gray-100">Seat No.</th>
                    <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-gray-400 border-r border-gray-100">Price (₹)</th>
                    <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-gray-400 border-r border-gray-100">Category</th>
                    <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-gray-400 border-r border-gray-100">Floor</th>
                    <th className="px-6 py-4 w-12 border-r border-gray-100"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/40 transition-colors group border-b border-dashed border-gray-200/80">
                      <td className="px-6 py-3 text-gray-300 font-black text-xs border-x border-gray-100">{idx + 1}</td>

                      <td className="px-6 py-3 border-r border-gray-100">
                        <input
                          value={row.seatNumber}
                          onChange={e => updateRow(idx, "seatNumber", e.target.value)}
                          className="w-24 bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                        />
                      </td>

                      <td className="px-6 py-3 border-r border-gray-100">
                        <input
                          type="number"
                          min={0}
                          value={row.price}
                          onChange={e => updateRow(idx, "price", Number(e.target.value))}
                          className="w-28 bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                        />
                      </td>

                      <td className="px-6 py-3 border-r border-gray-100">
                        <select
                          value={row.type}
                          onChange={e => updateRow(idx, "type", e.target.value as "normal" | "ac")}
                          className={`bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all appearance-none cursor-pointer ${
                            row.type === "ac" ? "text-indigo-600" : "text-gray-700"
                          }`}
                        >
                          <option value="normal">Normal</option>
                          <option value="ac">AC</option>
                        </select>
                      </td>

                      <td className="px-6 py-3 border-r border-gray-100">
                        {floors.length > 0 ? (
                          <select
                            value={row.floor}
                            onChange={e => updateRow(idx, "floor", e.target.value)}
                            className="bg-gray-50/50 capitalize border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all cursor-pointer appearance-none"
                          >
                            {floors.map(fl => (
                              <option key={fl} value={fl}>{fl}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={row.floor}
                            onChange={e => updateRow(idx, "floor", e.target.value)}
                            className="w-28 bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                          />
                        )}
                      </td>

                      <td className="px-6 py-3 border-r border-gray-100">
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

          <div className="flex justify-end gap-4 p-6 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/seat-management")}
              className="px-8 py-3 rounded-lg text-sm font-bold border-gray-300/70 bg-white hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || rows.length === 0}
              isLoading={submitting}
              className="px-8 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
              color="#2563eb"
              hoverColor="#1d4ed8"
              icon="mingcute:save-fill"
            >
              {submitting ? "Registering seats..." : `Register ${rows.length} Seats`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
