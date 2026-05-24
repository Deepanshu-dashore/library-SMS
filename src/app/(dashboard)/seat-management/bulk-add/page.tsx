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
import { useSelector } from "react-redux";
import clsx from "clsx";

interface BulkSeatRow {
  seatNumber: string;
  price: number;
  type: "normal" | "ac";
  floor: string;
}

export default function BulkAddSeatsPage() {
  const router = useRouter();
  const { mode } = useSelector((state: any) => state.theme);
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
          <div className={clsx(
            "rounded-xl p-8 md:p-10 border",
            mode === "dark"
              ? "bg-[#1c252e] border-gray-800 shadow-none ring-0"
              : "bg-white border-gray-100 shadow-sm ring-1 ring-gray-100"
          )}>
            <div className={clsx(
              "flex p-2 rounded-sm items-center gap-4 mb-16",
              mode === "dark" ? "bg-slate-800/60" : "bg-gray-100"
            )}>
              <div className={clsx(
                "w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg",
                mode === "dark" ? "bg-slate-700 text-slate-100" : "bg-gray-800 text-white"
              )}>01</div>
              <div>
                <h3 className={clsx("text-lg font-bold", mode === "dark" ? "text-slate-200" : "text-gray-800")}>Batch Configuration</h3>
                <p className={clsx("text-xs font-medium", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Set your defaults — fine-tune each row individually on the next step.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seat Count */}
              <div className="space-y-2">
                <label className={clsx("text-[12px] mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>
                  <Layers3 size={14} /> Total Seat Count
                </label>
                <input
                  type="number"
                  min={1} max={500}
                  value={config.count}
                  onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}
                  className={clsx(
                    "w-full text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                    mode === "dark"
                      ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                  )}
                />
              </div>

              {/* Numbering Pattern */}
              <div className="space-y-2">
                <label className={clsx("text-[12px] mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>
                  <Settings2 size={14} /> Seat Numbering (Prefix + Start)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="S"
                    value={config.prefix}
                    onChange={e => setConfig(c => ({ ...c, prefix: e.target.value.toUpperCase() }))}
                    className={clsx(
                      "w-20 text-center text-sm px-4 py-2.5 rounded-lg outline-none transition-all border",
                      mode === "dark"
                        ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                    )}
                  />
                  <input
                    type="number"
                    min={1}
                    value={config.startFrom}
                    onChange={e => setConfig(c => ({ ...c, startFrom: Number(e.target.value) }))}
                    className={clsx(
                      "flex-1 text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                      mode === "dark"
                        ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                    )}
                  />
                </div>
                <p className={clsx("text-xs font-bold pt-1", mode === "dark" ? "text-slate-400" : "text-gray-400")}>
                  Preview: <span className={clsx(mode === "dark" ? "text-slate-300" : "text-gray-600")}>
                    {config.prefix}{config.startFrom}, {config.prefix}{config.startFrom + 1} … {config.prefix}{config.startFrom + config.count - 1}
                  </span>
                </p>
              </div>

              {/* Default Price */}
              <div className="space-y-2">
                <label className={clsx("text-[12px] mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>
                  <IndianRupee size={14} /> Default Monthly Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.defaultPrice}
                  onChange={e => setConfig(c => ({ ...c, defaultPrice: Number(e.target.value) }))}
                  className={clsx(
                    "w-full text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                    mode === "dark"
                      ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                  )}
                />
              </div>

              {/* Default Floor */}
              <div className="space-y-2">
                <label className={clsx("text-[12px] mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Default Floor</label>
                {floors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {floors.map(fl => (
                      <button
                        key={fl}
                        type="button"
                        onClick={() => setConfig(c => ({ ...c, defaultFloor: fl }))}
                        className={clsx(
                          "px-5 capitalize py-2.5 rounded-lg text-sm font-bold transition-all border",
                          config.defaultFloor === fl
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : (mode === "dark"
                              ? "bg-slate-900 text-gray-400 border-gray-800 hover:border-gray-700 cursor-pointer"
                              : "bg-gray-50 cursor-pointer border border-gray-200 text-gray-500 hover:border-gray-300"
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
                      type="text"
                      placeholder="e.g. Ground, 1st, 2nd"
                      value={config.defaultFloor}
                      onChange={e => setConfig(c => ({ ...c, defaultFloor: e.target.value }))}
                      className={clsx(
                        "w-full text-sm px-5 py-2.5 rounded-lg outline-none transition-all border",
                        mode === "dark"
                          ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                          : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                      )}
                    />
                    <p className="text-xs text-amber-600 font-bold">
                      ⚠️ No floors configured. Add them in Settings → Edit Profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Default Type */}
              <div className="space-y-2 md:col-span-2">
                <label className={clsx("text-[12px] mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2", mode === "dark" ? "text-gray-400" : "text-gray-500")}>Default Seat Category</label>
                <div className={clsx(
                  "relative flex p-1 rounded-lg w-full border sm:max-w-md",
                  mode === "dark" ? "bg-slate-900 border-gray-800" : "bg-gray-100 border-gray-200/60"
                )}>
                  <div
                    className={clsx(
                      "absolute top-1 bottom-1 left-1 rounded-[6px] transition-transform duration-300 ease-out",
                      mode === "dark" ? "bg-slate-800 shadow-none" : "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                    )}
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
                      className={clsx(
                        "relative flex-1 py-2.5 text-sm font-bold rounded-md transition-colors z-10",
                        config.defaultType === type
                          ? "text-white"
                          : (mode === "dark" ? "bg-transparent text-gray-400 hover:text-white cursor-pointer" : "bg-transparent text-gray-500 hover:text-gray-700 cursor-pointer")
                      )}
                    >
                      {type === "ac" ? "AC Seat" : "Normal Seat"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={clsx("flex justify-end pt-4 mt-6 border-t", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
              <Button
                onClick={generateRows}
                disabled={!config.count || !config.prefix || !config.defaultFloor}
                className={clsx(
                  "px-8 py-3 rounded-lg text-sm font-bold text-white shadow-md flex items-center gap-2",
                  mode === "dark" ? "bg-indigo-600 hover:bg-indigo-700 shadow-none border-indigo-600" : "bg-gray-800 hover:bg-indigo-700"
                )}
                color={mode === "dark" ? undefined : "#1e2939"}
                hoverColor={mode === "dark" ? undefined : "#1e2960"}
              >
                Generate Preview Table <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={clsx(
            "rounded-xl shadow-sm border overflow-hidden",
            mode === "dark"
              ? "bg-[#1c252e] border-gray-800 shadow-none ring-0"
              : "bg-white border-gray-100 shadow-sm ring-1 ring-gray-100"
          )}>
            <div className={clsx(
              "flex items-center justify-between px-8 py-6 border-b",
              mode === "dark" ? "border-gray-800 bg-slate-800/20" : "border-gray-100 bg-gray-50/50"
            )}>
              <div className={clsx(
                "flex p-2 rounded-sm items-center gap-4",
                mode === "dark" ? "bg-slate-800/40" : "bg-gray-100"
              )}>
                <div className={clsx(
                  "w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg",
                  mode === "dark" ? "bg-slate-700 text-slate-100" : "bg-blue-600 text-white"
                )}>02</div>
                <div>
                  <h3 className={clsx("text-lg font-bold", mode === "dark" ? "text-slate-200" : "text-gray-800")}>Review & Fine-tune</h3>
                  <p className={clsx("text-xs font-medium", mode === "dark" ? "text-gray-400" : "text-gray-500")}>{rows.length} seats ready — edit any row, then submit</p>
                </div>
              </div>
              <button
                onClick={() => setStep("config")}
                className={clsx(
                  "text-sm flex items-center gap-2 cursor-pointer font-semibold transition-colors px-4 py-2 border rounded-xl",
                  mode === "dark"
                    ? "bg-transparent border-gray-800 text-gray-400 hover:text-gray-300 hover:bg-slate-800"
                    : "bg-white border-gray-200 text-gray-400 hover:text-gray-700"
                )}
              >
                <ChevronLeft size={18} /> Prev Step
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={clsx(
                    "border-b",
                    mode === "dark" ? "bg-slate-800/40 border-gray-800" : "bg-gray-50 border-gray-200"
                  )}>
                    <th className={clsx("px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest w-12 border-x", mode === "dark" ? "text-slate-400 border-gray-800" : "text-gray-400 border-gray-100")}>#</th>
                    <th className={clsx("px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest border-r", mode === "dark" ? "text-slate-400 border-gray-800" : "text-gray-400 border-gray-100")}>Seat No.</th>
                    <th className={clsx("px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest border-r", mode === "dark" ? "text-slate-400 border-gray-800" : "text-gray-400 border-gray-100")}>Price (₹)</th>
                    <th className={clsx("px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest border-r", mode === "dark" ? "text-slate-400 border-gray-800" : "text-gray-400 border-gray-100")}>Category</th>
                    <th className={clsx("px-6 py-4 text-left text-[12px] font-bold uppercase tracking-widest border-r", mode === "dark" ? "text-slate-400 border-gray-800" : "text-gray-400 border-gray-100")}>Floor</th>
                    <th className={clsx("px-6 py-4 w-12 border-r", mode === "dark" ? "border-gray-800" : "border-gray-100")}></th>
                  </tr>
                </thead>
                <tbody className={clsx("divide-y", mode === "dark" ? "divide-gray-800" : "divide-gray-200")}>
                  {rows.map((row, idx) => (
                    <tr key={idx} className={clsx(
                      "transition-colors group border-b border-dashed",
                      mode === "dark"
                        ? "hover:bg-slate-800/20 border-gray-800"
                        : "hover:bg-gray-50/40 border-gray-200/80"
                    )}>
                      <td className={clsx("px-6 py-3 font-black text-xs border-x", mode === "dark" ? "text-slate-500 border-gray-800" : "text-gray-300 border-gray-100")}>{idx + 1}</td>

                      <td className={clsx("px-6 py-3 border-r", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                        <input
                          value={row.seatNumber}
                          onChange={e => updateRow(idx, "seatNumber", e.target.value)}
                          className={clsx(
                            "w-24 border rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all",
                            mode === "dark"
                              ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                              : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                          )}
                        />
                      </td>

                      <td className={clsx("px-6 py-3 border-r", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                        <input
                          type="number"
                          min={0}
                          value={row.price}
                          onChange={e => updateRow(idx, "price", Number(e.target.value))}
                          className={clsx(
                            "w-28 border rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all",
                            mode === "dark"
                              ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                              : "bg-gray-50/50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                          )}
                        />
                      </td>

                      <td className={clsx("px-6 py-3 border-r", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                        <select
                          value={row.type}
                          onChange={e => updateRow(idx, "type", e.target.value as "normal" | "ac")}
                          className={clsx(
                            "border rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all appearance-none cursor-pointer",
                            row.type === "ac" ? "text-indigo-600" : (mode === "dark" ? "text-gray-300" : "text-gray-700"),
                            mode === "dark"
                              ? "bg-slate-900 border-gray-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                              : "bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                          )}
                        >
                          <option value="normal" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>Normal</option>
                          <option value="ac" className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>AC</option>
                        </select>
                      </td>

                      <td className={clsx("px-6 py-3 border-r", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                        {floors.length > 0 ? (
                          <select
                            value={row.floor}
                            onChange={e => updateRow(idx, "floor", e.target.value)}
                            className={clsx(
                              "capitalize border rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all cursor-pointer appearance-none",
                              mode === "dark"
                                ? "bg-slate-900 border-gray-800 text-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                : "bg-gray-50/50 border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                            )}
                          >
                            {floors.map(fl => (
                              <option key={fl} value={fl} className={clsx(mode === "dark" && "bg-[#1c252e] text-white")}>{fl}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={row.floor}
                            onChange={e => updateRow(idx, "floor", e.target.value)}
                            className={clsx(
                              "w-28 border rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all",
                              mode === "dark"
                                ? "bg-slate-900 border-gray-800 text-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                : "bg-gray-50/50 border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                            )}
                          />
                        )}
                      </td>

                      <td className={clsx("px-6 py-3 border-r", mode === "dark" ? "border-gray-800" : "border-gray-100")}>
                        <button
                          onClick={() => removeRow(idx)}
                          className={clsx(
                            "p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                            mode === "dark"
                              ? "text-slate-500 hover:text-red-400 hover:bg-red-950/20"
                              : "text-gray-200 hover:text-red-400 hover:bg-red-50"
                          )}
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
              className={clsx(
                "px-8 py-3 rounded-lg text-sm font-bold border",
                mode === "dark"
                  ? "border-gray-800 text-gray-300 hover:bg-slate-800 bg-transparent hover:text-white"
                  : "border-gray-300/70 bg-white hover:bg-gray-50 text-gray-600"
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || rows.length === 0}
              isLoading={submitting}
              className={clsx(
                "px-8 py-3 rounded-lg text-sm font-bold text-white shadow-md",
                mode === "dark"
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-none border-indigo-600"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              )}
              color={mode === "dark" ? undefined : "#2563eb"}
              hoverColor={mode === "dark" ? undefined : "#1d4ed8"}
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
