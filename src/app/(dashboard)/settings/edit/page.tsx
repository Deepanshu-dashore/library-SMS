"use client";

import React, { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Save, X, Phone, Mail, MapPin, Clock, Calendar, Plus, Upload, Building, PenTool, Globe, Layers } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useDispatch } from "react-redux";
import { setUserSuccess } from "@/store/userSlice";

// ─── Design tokens ────────────────────────────────────────────────────────────

const inputBase =
  "w-full text-sm px-5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none font-medium text-gray-900";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[12px] mb-1.5 inline-block font-bold text-gray-500 uppercase tracking-widest">
    {children}
  </label>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <span className="mt-1 text-[11px] text-gray-400 leading-snug block font-medium">
    {children}
  </span>
);

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  step, title, sub, color,
}: { step: string; title: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-4 mb-10 bg-gray-100/70 p-1.5 rounded-xl">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center font-bold text-sm`}>
        {step}
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500 font-medium">{sub}</p>
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
    <div className="space-y-2">
      <Label>{label}</Label>
      {preview ? (
        <div className="relative w-full border border-gray-200 rounded-xl overflow-hidden bg-gray-50/30">
          <img src={preview} alt={label} className="w-full h-32 object-contain p-4 mix-blend-multiply" />
          <button
            type="button"
            onClick={() => { onClear(); if (ref.current) ref.current.value = ""; }}
            className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg p-1 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full flex flex-col items-center gap-3 py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all group"
        >
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <div className="text-center">
             <p className="text-xs font-bold text-gray-600 group-hover:text-blue-600">Click to upload {label.toLowerCase()}</p>
             <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG or WebP</p>
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

  // Local state for file previews to avoid constant URL.createObjectURL calls in render
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

  const handleHolidaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        toast.success("Profile updated successfully");
        router.push("/settings");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col font-sans max-w-6xl mx-auto w-full">
      <PageHeader
        title="Edit Library Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Edit" },
        ]}
        backLink="/settings"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── 01 Identity & Contact ── */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 md:p-10 ring-1 ring-gray-100">
          <SectionHeader
            step="01"
            title="Identity & Global Contact"
            sub="Essential identification and reachable addresses"
            color="bg-blue-100 text-blue-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <Label>Library Name *</Label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Central Library"
                className={inputBase}
              />
            </div>

            <div>
              <Label>Official Email *</Label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@library.com"
                className={inputBase}
              />
            </div>

            <div>
              <Label>Official Phone</Label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 00000 00000"
                className={inputBase}
              />
            </div>

            <ImageUploadField
              label="Library Logo"
              hint="Recommended size: 512x512px"
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
              label="Official Signature"
              hint="For documents & certifications"
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

            <div className="flex flex-col gap-2">
               <Label>Quick Configuration</Label>
               <div className="flex flex-wrap gap-2">
                  <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg text-xs font-black border border-blue-100 flex items-center gap-2">
                    <Building size={14} /> {formData.floors?.length || 0} Floors
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg text-xs font-black border border-emerald-100 flex items-center gap-2">
                    <Globe size={14} /> Active Session
                  </div>
               </div>
               <Hint>Summary of current library architecture.</Hint>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Label>Primary Physical Address</Label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="Global office or headquarters location..."
                className={`${inputBase} resize-none`}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ── 02 Infrastructure ── */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 md:p-10 ring-1 ring-gray-100">
          <SectionHeader
            step="02"
            title="Library Infrastructure"
            sub="Configure internal layouts and sections"
            color="bg-purple-100 text-purple-600"
          />

          <div className="space-y-4">
             <Label>Registered Floors</Label>
             <div className="flex flex-wrap gap-3 items-center">
                {(formData.floors || []).map((floor, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-5 py-3 rounded-xl font-bold border border-purple-100 text-sm">
                    <Layers size={14} className="text-purple-400" />
                    {floor}
                    <button type="button" onClick={() => handleRemoveFloor(idx)} className="ml-1 text-purple-300 hover:text-red-500 transition-colors">
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFloor}
                  className="flex items-center gap-2 bg-white border-2 border-dashed border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 px-6 py-3 rounded-xl font-bold transition-all text-sm"
                >
                  <Plus size={16} strokeWidth={3} /> Add New Level
                </button>
             </div>
             <Hint>These floors will be visible in seat management modules.</Hint>
          </div>
        </div>

        {/* ── 03 Support Desk ── */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 md:p-10 ring-1 ring-gray-100">
          <SectionHeader
            step="03"
            title="Support & Help Desk"
            sub="Public assistance details for students"
            color="bg-amber-100 text-amber-600"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
             <div>
               <Label>Support Hotline</Label>
               <div className="relative">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input
                   type="text"
                   name="number"
                   value={formData.helpDesk.number}
                   onChange={handleHelpDeskChange}
                   className={`${inputBase} pl-12`}
                   placeholder="1800-000-0000"
                 />
               </div>
             </div>

             <div>
               <Label>Support Email</Label>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input
                   type="email"
                   name="email"
                   value={formData.helpDesk.email}
                   onChange={handleHelpDeskChange}
                   className={`${inputBase} pl-12`}
                   placeholder="support@library.com"
                 />
               </div>
             </div>

             <div>
               <Label>Operating Hours</Label>
               <div className="relative">
                 <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input
                   type="text"
                   name="hours"
                   value={formData.helpDesk.hours}
                   onChange={handleHelpDeskChange}
                   placeholder="e.g. 08:00 AM - 10:00 PM"
                   className={`${inputBase} pl-12`}
                 />
               </div>
             </div>

             <div>
               <Label>Public Holidays (Comma separated)</Label>
               <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input
                   type="text"
                   name="holidays"
                   value={formData.helpDesk.holidays.join(", ")}
                   onChange={handleHolidaysChange}
                   placeholder="Sunday, Diwali, etc."
                   className={`${inputBase} pl-12`}
                 />
               </div>
             </div>

             <div className="md:col-span-2">
               <Label>Support Desk Specific Location</Label>
               <textarea
                 name="address"
                 rows={2}
                 value={formData.helpDesk.address}
                 onChange={handleHelpDeskChange}
                 placeholder="Specific floor or room for support..."
                 className={`${inputBase} resize-none`}
               ></textarea>
             </div>
          </div>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex justify-end gap-3 pt-4 pb-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/settings")}
            className="px-10 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all font-sans"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="px-12 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/10 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={20} /> Update Framework</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
