"use client";

import React, { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Save, X, Phone, Mail, MapPin, Clock, Calendar, Plus, Upload, Building, PenTool, Globe, Layers } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { setUserSuccess } from "@/store/userSlice";

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase =
  "w-full text-[14px] px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] mb-2 px-1 inline-block font-black text-slate-400 uppercase tracking-[0.1em]">
    {children}
  </label>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <span className="mt-2 px-1 text-[11px] text-slate-400 leading-snug block font-bold italic">
    {children}
  </span>
);

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon, title, sub, colorBadge,
}: { icon: string; title: string; sub: string; colorBadge: string }) {
  return (
    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
      <div className={`w-14 h-14 ${colorBadge} rounded-[20px] flex items-center justify-center shadow-sm shrink-0`}>
        <Icon icon={icon} width={28} />
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{sub}</p>
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
}

function ImageUploadField({ label, hint, preview, onFile, onClear }: ImageUploadFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {preview ? (
        <div className="relative w-full border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-inner group">
          <img src={preview} alt={label} className="w-full h-40 object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
          <button
            type="button"
            onClick={() => { onClear(); if (ref.current) ref.current.value = ""; }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-2 hover:bg-red-50 hover:border-red-200 transition-all shadow-xl active:scale-95 group"
          >
            <X className="w-4 h-4 text-slate-500 group-hover:text-red-500" strokeWidth={3} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full flex flex-col items-center gap-4 py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
             <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
             <p className="text-[13px] font-black text-slate-600 group-hover:text-indigo-600">Register {label}</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">High fidelity JPG/PNG</p>
          </div>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <Hint>{hint}</Hint>
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
    <div className="bg-gray-50/50 min-h-screen font-public-sans pb-20">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Edit Framework"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Edit Profile" },
          ]}
          backLink="/settings"
        />

        <form onSubmit={handleSubmit} className="px-6 pt-0 space-y-10 focus-within:outline-none">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Col: Core Identity */}
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white rounded-[40px] shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_24px_48px_-8px_rgba(145,158,171,0.12)] border border-gray-100 p-10 md:p-12">
                <SectionHeader
                  icon="solar:shield-user-bold-duotone"
                  title="Organization Identity"
                  sub="Global identifiers and branding assets"
                  colorBadge="bg-indigo-50 text-indigo-600"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <Label>Library Full Name</Label>
                    <div className="relative">
                      <Icon icon="solar:library-bold-duotone" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" width={22} />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Central National Library"
                        className={`${inputBase} pl-14`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Official Support Email</Label>
                    <div className="relative">
                      <Icon icon="solar:letter-bold-duotone" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" width={22} />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="support@library.com"
                        className={`${inputBase} pl-14`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Registered Phone</Label>
                    <div className="relative">
                      <Icon icon="solar:phone-bold-duotone" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" width={22} />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className={`${inputBase} pl-14`}
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
                  />

                  <div className="md:col-span-2">
                    <Label>Official Corporate Address</Label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter the full physical location of headquarters..."
                      className={`${inputBase} resize-none min-h-[120px]`}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="bg-white rounded-[40px] shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_24px_48px_-8px_rgba(145,158,171,0.12)] border border-gray-100 p-10 md:p-12">
                <SectionHeader
                  icon="solar:layers-bold-duotone"
                  title="Internal Infrastructure"
                  sub="Defining structural levels and floor plans"
                  colorBadge="bg-purple-50 text-purple-600"
                />

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    {(formData.floors || []).map((floor, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-xl group hover:bg-slate-800 transition-all">
                        <Icon icon="solar:ranking-bold-duotone" width={18} className="text-purple-400" />
                        {floor}
                        <button type="button" onClick={() => handleRemoveFloor(idx)} className="ml-2 text-white/30 hover:text-red-400 transition-colors">
                          <X size={20} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddFloor}
                      className="flex items-center gap-3 bg-white border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 px-8 py-4 rounded-2xl font-black transition-all text-sm group"
                    >
                      <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                      Assign New Floor
                    </button>
                  </div>
                  <Hint>These labels are used globally within the seat allocation system.</Hint>
                </div>
              </div>
            </div>

            {/* Right Col: Support & Action */}
            <div className="space-y-10">
              <div className="bg-slate-900 rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform">
                   <Icon icon="solar:help-bold-duotone" width={240} />
                </div>

                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Icon icon="solar:headphones-round-bold-duotone" width={24} className="text-indigo-400" />
                   </div>
                   <h3 className="text-lg font-black tracking-tight">Support Desk</h3>
                </div>

                <div className="space-y-8 relative z-10">
                   <div className="space-y-6">
                      <div>
                        <Label>Support Hotline</Label>
                        <input
                          type="text"
                          name="number"
                          value={formData.helpDesk.number}
                          onChange={handleHelpDeskChange}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                          placeholder="Hotline number"
                        />
                      </div>
                      <div>
                        <Label>Desk Email</Label>
                        <input
                          type="email"
                          name="email"
                          value={formData.helpDesk.email}
                          onChange={handleHelpDeskChange}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                          placeholder="support@domain.com"
                        />
                      </div>
                      <div>
                        <Label>Operating Hours</Label>
                        <input
                          type="text"
                          name="hours"
                          value={formData.helpDesk.hours}
                          onChange={handleHelpDeskChange}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                          placeholder="e.g. 9 AM - 6 PM"
                        />
                      </div>
                      <div>
                        <Label>Holidays</Label>
                        <textarea
                          name="holidays"
                          rows={2}
                          value={formData.helpDesk.holidays.join(", ")}
                          onChange={handleHolidaysChange}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all resize-none"
                          placeholder="Comma separated days"
                        ></textarea>
                      </div>
                   </div>
                </div>
              </div>

              {/* Form Action */}
              <div className="bg-white rounded-[40px] border border-gray-100 p-10 flex flex-col gap-4 shadow-xl">
                 <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Icon icon="solar:diskette-bold-duotone" width={24} /> Sync All Changes</>}
                 </Button>
                 <Button
                    type="button"
                    onClick={() => router.push("/settings")}
                    variant="outline"
                    className="w-full py-5 font-black text-slate-500 border-slate-100 rounded-3xl hover:bg-slate-50"
                 >
                    Discard Changes
                 </Button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
