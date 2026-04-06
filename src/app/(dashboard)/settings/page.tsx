"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Building, Mail, Phone, MapPin, Edit3, Clock, Calendar, HelpCircle } from "lucide-react";
import Link from "next/link";

interface HelpDesk {
  number: string;
  email: string;
  address: string;
  hours: string;
  holidays: string[];
}

interface LibraryProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  helpDesk?: HelpDesk;
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
    <div className="p-6 h-full flex flex-col font-sans max-w-5xl mx-auto w-full pb-20">
      <PageHeader
        title="Library Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings" },
        ]}
        actionNode={
          <Link
            href="/settings/edit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95 shadow-blue-500/20"
          >
            <Edit3 className="w-5 h-5 stroke-[2.5px]" />
            Edit Profile
          </Link>
        }
      />

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Hero Card */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative group">
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-br from-blue-600/5 to-purple-600/5 border-b border-gray-100" />
          
          <div className="p-10 pt-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="w-40 h-40 rounded-[32px] bg-white shadow-2xl shadow-gray-200/50 flex items-center justify-center border-4 border-white overflow-hidden shrink-0 z-10 p-2">
                {profile.logo ? (
                  <img src={profile.logo} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <Building className="w-20 h-20 text-blue-200" />
                )}
              </div>
              <div className="text-center md:text-left mb-4">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{profile.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-gray-500 font-bold text-sm tracking-wide">
                  <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full ring-1 ring-blue-100 shadow-sm uppercase tracking-widest text-[10px]">Administrator</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="bg-gray-50 px-4 py-1.5 rounded-full ring-1 ring-gray-100 uppercase tracking-widest text-[10px]">Official Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Global Contact Info */}
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-10 flex items-center gap-2">
                <Building size={16} strokeWidth={3} /> Global Contact Identity
              </h3>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-blue-50/50 text-blue-600 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={22} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Library Email Address</p>
                    <p className="text-xl font-bold text-gray-900 tracking-tight">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-emerald-50/50 text-emerald-600 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={22} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Primary Phone Number</p>
                    <p className="text-xl font-bold text-gray-900 tracking-tight">{profile.phone || "No phone added"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-amber-50/50 text-amber-600 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={22} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Global Physical Office</p>
                    <p className="text-lg font-bold text-gray-900 leading-snug max-w-lg">{profile.address || "Address not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Desk Dashboard Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 rounded-[32px] p-8 shadow-2xl shadow-gray-200 text-white overflow-hidden relative group h-full">
              <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-500 opacity-20">
                <HelpCircle size={120} />
              </div>

              <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-8 flex items-center gap-2">
                Help Desk & Student Support
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 leading-none">Support Hotline</p>
                  <p className="text-2xl font-black">{profile.helpDesk?.number || "Not Set"}</p>
                  {profile.helpDesk?.email && <p className="text-sm font-bold text-blue-400 mt-1">{profile.helpDesk.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 leading-none">Schedule</p>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Clock size={16} className="text-blue-400 shrink-0" />
                      <span>{profile.helpDesk?.hours || "N/A"}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 leading-none">Holidays</p>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Calendar size={16} className="text-amber-400 shrink-0" />
                      <span>{profile.helpDesk?.holidays?.length || 0} Listed</span>
                    </div>
                  </div>
                </div>

                {profile.helpDesk?.address && (
                  <div className="bg-indigo-600/30 p-6 rounded-2xl border border-indigo-400/20">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 leading-none">Desk Location</p>
                    <p className="text-sm font-bold leading-relaxed">{profile.helpDesk.address}</p>
                  </div>
                )}
                
                {profile.helpDesk?.holidays && profile.helpDesk.holidays.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                     {profile.helpDesk.holidays.map((h, i) => (
                       <span key={i} className="px-3 py-1 bg-white/10 text-[10px] font-black uppercase rounded-full border border-white/10">{h}</span>
                     ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
