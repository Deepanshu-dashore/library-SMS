"use client";

import React, { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { setUserSuccess } from "@/store/userSlice";

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase =
  "w-full text-sm px-4 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none font-medium placeholder:font-normal";

const Label = ({ children, mode }: { children: React.ReactNode; mode?: string }) => (
  <label className={`text-xs mb-1.5 px-1 inline-block font-semibold uppercase tracking-wider ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
    {children}
  </label>
);

const Hint = ({ children, mode }: { children: React.ReactNode; mode?: string }) => (
  <span className={`mt-1.5 px-1 text-[11px] leading-snug block font-medium ${mode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
    {children}
  </span>
);

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon, title, sub, colorBadge, mode,
}: { icon: string; title: string; sub: string; colorBadge: string; mode?: string }) {
  return (
    <div className={`flex items-center gap-4 mb-8 pb-5 border-b ${mode === 'dark' ? 'border-slate-700/60' : 'border-gray-100'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mode === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : colorBadge}`}>
        <Icon icon={icon} width={24} />
      </div>
      <div>
        <h3 className={`text-lg font-semibold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{sub}</p>
      </div>
    </div>
  );
}

// ─── Image Upload Field ───────────────────────────────────────────────────────

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  preview: string;
  onFile: (file: File) => void;
  onClear: () => void;
  mode?: string;
}

function ImageUploadField({ label, hint, preview, onFile, onClear, mode }: ImageUploadFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="space-y-1.5">
      <Label mode={mode}>{label}</Label>
      {preview ? (
        <div className={`relative w-full border rounded-2xl overflow-hidden group ${mode === 'dark' ? 'bg-slate-900 border-slate-700 shadow-none' : 'bg-white border-slate-200 shadow-inner'}`}>
          <img src={preview} alt={label} className={`w-full h-36 object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${mode === 'dark' ? '' : 'mix-blend-multiply'}`} />
          <button
            type="button"
            onClick={() => { onClear(); if (ref.current) ref.current.value = ""; }}
            className={`absolute top-3 right-3 rounded-lg p-2 transition-all shadow-md active:scale-95 group ${mode === 'dark' ? 'bg-slate-800 border border-slate-700 hover:bg-red-950/30 hover:border-red-900/50' : 'bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-red-50 hover:border-red-200'}`}
          >
            <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`w-full flex flex-col items-center gap-3 py-8 border-2 border-dashed rounded-2xl transition-all group ${mode === 'dark' ? 'bg-slate-900/30 border-slate-700 hover:bg-slate-800 hover:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-400 hover:shadow-md'}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${mode === 'dark' ? 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
             <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
             <p className={`text-xs font-semibold ${mode === 'dark' ? 'text-slate-300 group-hover:text-indigo-400' : 'text-slate-600 group-hover:text-indigo-600'}`}>Register {label}</p>
             <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">High fidelity JPG/PNG</p>
          </div>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <Hint mode={mode}>{hint}</Hint>
    </div>
  );
}

interface HelpDesk {
  number: string;
  email: string;
  address: string;
  hours: string;
  holidays: string[];
}

interface LibraryProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string | File;
  signature: string | File;
  helpDesk: HelpDesk;
  floors?: string[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mode } = useSelector((state: any) => state.theme);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<LibraryProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    signature: "",
    helpDesk: {
      number: "",
      email: "",
      address: "",
      hours: "",
      holidays: [],
    },
    floors: [],
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [sigPreview, setSigPreview] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/library/profile");
        const data = await res.json();
        if (res.ok && data.success) {
          const profile = data.data;
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            address: profile.address || "",
            logo: profile.logo || "",
            signature: profile.signature || "",
            floors: profile.floors || [],
            helpDesk: {
              number: profile.helpDesk?.number || "",
              email: profile.helpDesk?.email || "",
              address: profile.helpDesk?.address || "",
              hours: profile.helpDesk?.hours || "",
              holidays: profile.helpDesk?.holidays || [],
            },
          });
          if (profile.logo) setLogoPreview(profile.logo);
          if (profile.signature) setSigPreview(profile.signature);
        } else {
          toast.error(data.message || "Failed to load profile.");
          router.push("/settings");
        }
      } catch (error) {
        toast.error("An error occurred while loading the profile.");
        router.push("/settings");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHelpDeskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      helpDesk: { ...prev.helpDesk, [name]: value },
    }));
  };

  const handleHolidaysChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    const holidays = value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      helpDesk: { ...prev.helpDesk, holidays },
    }));
  };

  const handleAddFloor = () => {
    const floor = prompt("Enter new floor name (e.g., 1st Floor):");
    if (floor && floor.trim()) {
      setFormData(prev => ({
        ...prev,
        floors: [...(prev.floors || []), floor.trim()]
      }));
    }
  };

  const handleRemoveFloor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      floors: prev.floors?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = toast.loading("Syncing profile framework...");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("helpDesk", JSON.stringify(formData.helpDesk));
      formDataToSend.append("floors", JSON.stringify(formData.floors || []));

      if (formData.logo && typeof formData.logo !== "string") {
        formDataToSend.append("logo", formData.logo);
      }
      if (formData.signature && typeof formData.signature !== "string") {
        formDataToSend.append("signature", formData.signature);
      }

      const response = await fetch("/api/library/profile", {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(setUserSuccess(data.data));
        toast.success("Profile updated successfully", { id: t });
        router.push("/settings");
      } else {
        toast.error(data.message || "Failed to update profile", { id: t });
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile", { id: t });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-public-sans pb-20 ${mode === 'dark' ? 'bg-transparent' : 'bg-gray-50/50'}`}>
      <div className=" mx-auto">
        <PageHeader
          title="Edit Framework"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Edit Profile" },
          ]}
          backLink="/settings"
        />

        <form onSubmit={handleSubmit} className="px-6 pt-0 space-y-8 focus-within:outline-none">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Col: Core Identity */}
            <div className="lg:col-span-2 space-y-8">
              <div className={`rounded-3xl border p-8 md:p-10 shadow-sm ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <SectionHeader
                  icon="solar:shield-user-bold-duotone"
                  title="Organization Identity"
                  sub="Global identifiers and branding assets"
                  colorBadge="bg-indigo-50 text-indigo-600"
                  mode={mode}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label mode={mode}>Library Full Name</Label>
                    <div className="relative">
                      <Icon icon="solar:library-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width={18} />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Central National Library"
                        className={`${inputBase} pl-11 ${mode === 'dark' ? 'bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-100 focus:border-indigo-600'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label mode={mode}>Official Support Email</Label>
                    <div className="relative">
                      <Icon icon="solar:letter-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width={18} />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="support@library.com"
                        className={`${inputBase} pl-11 ${mode === 'dark' ? 'bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-100 focus:border-indigo-600'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label mode={mode}>Registered Phone</Label>
                    <div className="relative">
                      <Icon icon="solar:phone-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width={18} />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className={`${inputBase} pl-11 ${mode === 'dark' ? 'bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-100 focus:border-indigo-600'}`}
                      />
                    </div>
                  </div>

                  <ImageUploadField
                    label="Library Logo"
                    hint="Preferred 1:1 ratio with white/transparent background"
                    preview={logoPreview}
                    onFile={(file) => {
                      setFormData(prev => ({ ...prev, logo: file }));
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                    onClear={() => {
                      setFormData(prev => ({ ...prev, logo: "" }));
                      setLogoPreview("");
                    }}
                    mode={mode}
                  />

                  <ImageUploadField
                    label="Chief Signature"
                    hint="Required for automated document certification"
                    preview={sigPreview}
                    onFile={(file) => {
                      setFormData(prev => ({ ...prev, signature: file }));
                      setSigPreview(URL.createObjectURL(file));
                    }}
                    onClear={() => {
                      setFormData(prev => ({ ...prev, signature: "" }));
                      setSigPreview("");
                    }}
                    mode={mode}
                  />

                  <div className="md:col-span-2">
                    <Label mode={mode}>Official Corporate Address</Label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter the full physical location of headquarters..."
                      className={`${inputBase} resize-none min-h-[100px] ${mode === 'dark' ? 'bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-100 focus:border-indigo-600'}`}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className={`rounded-3xl border p-8 md:p-10 shadow-sm ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <SectionHeader
                  icon="solar:layers-bold-duotone"
                  title="Internal Infrastructure"
                  sub="Defining structural levels and floor plans"
                  colorBadge="bg-purple-50 text-purple-600"
                  mode={mode}
                />

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {(formData.floors || []).map((floor, idx) => (
                      <div key={idx} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all ${mode === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        <Icon icon="solar:ranking-bold-duotone" width={14} className="text-purple-500" />
                        {floor}
                        <button type="button" onClick={() => handleRemoveFloor(idx)} className="ml-1 text-slate-400 hover:text-red-500 transition-colors">
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddFloor}
                      className={`flex items-center gap-2 border border-dashed px-5 py-2.5 rounded-xl font-semibold transition-all text-xs group ${mode === 'dark' ? 'bg-slate-700/55 border-slate-600 text-gray-300 hover:bg-slate-700 hover:border-indigo-400 hover:text-indigo-400' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-500 hover:text-indigo-600'}`}
                    >
                      <Plus size={14} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" />
                      Assign New Floor
                    </button>
                  </div>
                  <Hint mode={mode}>These labels are used globally within the seat allocation system.</Hint>
                </div>
              </div>
            </div>

            {/* Right Col: Support & Action */}
            <div className="space-y-8">
              <div className={`rounded-3xl shadow-lg p-8 relative overflow-hidden group border ${mode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-white' : 'bg-slate-900 text-white border-transparent'}`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 group-hover:scale-115 transition-transform duration-750 pointer-events-none">
                  <Icon icon="solar:help-bold-duotone" width={200} />
                </div>

                <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon icon="solar:headphones-round-bold-duotone" width={20} className="text-indigo-400" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">Support Desk</h3>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-5">
                    <div>
                      <Label mode="dark">Support Hotline</Label>
                      <input
                        type="text"
                        name="number"
                        value={formData.helpDesk.number}
                        onChange={handleHelpDeskChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="Hotline number"
                      />
                    </div>
                    <div>
                      <Label mode="dark">Desk Email</Label>
                      <input
                        type="email"
                        name="email"
                        value={formData.helpDesk.email}
                        onChange={handleHelpDeskChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="support@domain.com"
                      />
                    </div>
                    <div>
                      <Label mode="dark">Operating Hours</Label>
                      <input
                        type="text"
                        name="hours"
                        value={formData.helpDesk.hours}
                        onChange={handleHelpDeskChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 9 AM - 6 PM"
                      />
                    </div>
                    <div>
                      <Label mode="dark">Holidays</Label>
                      <textarea
                        name="holidays"
                        rows={2}
                        value={formData.helpDesk.holidays.join(", ")}
                        onChange={handleHolidaysChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                        placeholder="Comma separated days"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action */}
              <div className={`rounded-3xl border p-8 flex flex-col gap-3 shadow-md ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Icon icon="solar:diskette-bold-duotone" width={20} /> Sync All Changes</>}
                </Button>
                <button
                  type="button"
                  onClick={() => router.push("/settings")}
                  className={`w-full py-3.5 font-semibold text-sm border rounded-xl transition-all active:scale-95 text-center flex items-center justify-center ${mode === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent' : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent'}`}
                >
                  Discard Changes
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
