"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface LibraryProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/library/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="p-6 h-full flex flex-col font-sans max-w-4xl mx-auto w-full">
      <PageHeader
        title="Edit Library Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Edit" },
        ]}
        backLink="/settings"
      />

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Library Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-gray-700">Email Address</label>
               <input
                 type="email"
                 name="email"
                 required
                 value={formData.email}
                 onChange={handleChange}
                 className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
               />
             </div>

             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Phone Number (Optional)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Logo Image URL (Optional)</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Physical Address (Optional)</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Full physical address of the library"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[14px] font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-xs font-sans"
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-4 mt-8 border-t border-gray-50">
            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="px-8 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2 shadow-blue-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
