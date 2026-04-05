"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Building, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import Link from "next/link";

interface LibraryProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
}

export default function SettingsProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LibraryProfile | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/library/profile");
        const data = await res.json();
        if (res.ok && data.success) {
          setProfile(data.data);
        } else {
          toast.error(data.message || "Failed to load profile.");
        }
      } catch (error) {
        toast.error("An error occurred while loading the profile.");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  if (fetching) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-6 h-full flex flex-col font-sans max-w-4xl mx-auto w-full">
      <PageHeader
        title="Library Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings" },
        ]}
        actionNode={
          <Link
            href="/settings/edit"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95 shadow-blue-500/20"
          >
            <Edit3 className="w-5 h-5 stroke-[2.5px]" />
            Edit Details
          </Link>
        }
      />

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex items-center gap-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center border-4 border-white overflow-hidden shrink-0">
            {profile.logo ? (
              <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building className="w-10 h-10 text-blue-500" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-2 text-gray-500 font-medium text-sm">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">Administrator Account</span>
            </div>
          </div>
        </div>

        <div className="p-10">
          <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-400 mb-6">Contact & Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-base font-semibold text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-base font-semibold text-gray-900">{profile.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:col-span-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Physical Address</p>
                <p className="text-base font-semibold text-gray-900 max-w-lg">{profile.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
