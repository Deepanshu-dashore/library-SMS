"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Save, X, Phone, Mail, MapPin, Clock, Calendar, Layers, Plus } from "lucide-react";
import { Button } from "@/components/shared/Button";

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
  helpDesk: HelpDesk;
  floors?: string[];
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<LibraryProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    helpDesk: {
      number: "",
      email: "",
      address: "",
      hours: "",
      holidays: [],
    },
    floors: [],
  });

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
            floors: profile.floors || [],
            helpDesk: {
              number: profile.helpDesk?.number || "",
              email: profile.helpDesk?.email || "",
              address: profile.helpDesk?.address || "",
              hours: profile.helpDesk?.hours || "",
              holidays: profile.helpDesk?.holidays || [],
            },
          });
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

      const response = await fetch("/api/library/profile", {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
    <div className="p-6 h-full flex flex-col font-sans max-w-5xl mx-auto w-full pb-20">
      <PageHeader
        title="Edit Library Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Edit" },
        ]}
        backLink="/settings"
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-10 ring-1 ring-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">01</div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-500 font-medium">Global settings for your library identity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1">Library Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1">Official Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1">Official Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1">Library Logo Upload</label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={(e) => {
                   if (e.target.files && e.target.files[0]) {
                     setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
                   }
                }}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {typeof formData.logo === "string" && formData.logo && (
                <p className="text-xs text-green-600 font-bold pl-1 mt-1">Current logo is fully configured</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1">Global Address</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none shadow-xs font-sans"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Floors Configuration */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-10 ring-1 ring-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">02</div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Library Floors</h3>
              <p className="text-sm text-gray-500 font-medium">Configure floors to be used in Seat Management</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
             {(formData.floors || []).map((floor, idx) => (
               <div key={idx} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl font-black border border-purple-100">
                 {floor}
                 <button type="button" onClick={() => handleRemoveFloor(idx)} className="text-purple-400 hover:text-purple-900 transition-colors">
                   <X size={16} strokeWidth={3} />
                 </button>
               </div>
             ))}
             <Button
               type="button"
               variant="outline"
               onClick={handleAddFloor}
               className="flex items-center gap-2 bg-white border-2 border-dashed border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 px-5 py-2.5 rounded-xl font-bold transition-all"
             >
               <Plus size={16} strokeWidth={3} /> Add Floor
             </Button>
          </div>
        </div>

        {/* Help Desk Information */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-10 ring-1 ring-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">03</div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Help Desk Support</h3>
              <p className="text-sm text-gray-500 font-medium">Public facing support details for your students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                 <Phone size={14} /> Desk Number
               </label>
               <input
                 type="text"
                 name="number"
                 value={formData.helpDesk.number}
                 onChange={handleHelpDeskChange}
                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-sans"
               />
             </div>

             <div className="space-y-2">
               <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                 <Mail size={14} /> Support Email
               </label>
               <input
                 type="email"
                 name="email"
                 value={formData.helpDesk.email}
                 onChange={handleHelpDeskChange}
                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-sans"
               />
             </div>

             <div className="space-y-2">
               <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                 <Clock size={14} /> Working Hours
               </label>
               <input
                 type="text"
                 name="hours"
                 value={formData.helpDesk.hours}
                 onChange={handleHelpDeskChange}
                 placeholder="e.g. 08:00 AM - 10:00 PM"
                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-sans"
               />
             </div>

             <div className="space-y-2">
               <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                 <Calendar size={14} /> Holidays (Comma separated)
               </label>
               <input
                 type="text"
                 name="holidays"
                 value={formData.helpDesk.holidays.join(", ")}
                 onChange={handleHolidaysChange}
                 placeholder="e.g. Sunday, Diwali"
                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-sans"
               />
             </div>

             <div className="space-y-2 md:col-span-2">
               <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                 <MapPin size={14} /> Support Desk Address
               </label>
               <textarea
                 name="address"
                 rows={2}
                 value={formData.helpDesk.address}
                 onChange={handleHelpDeskChange}
                 className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-[14px] font-semibold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all resize-none font-sans"
               ></textarea>
             </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/settings")}
            className="px-10 py-5 rounded-[24px] border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="px-12 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-500/20 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save size={22} /> Save Profile</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
