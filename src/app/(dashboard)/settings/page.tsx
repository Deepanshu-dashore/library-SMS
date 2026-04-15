"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Building, Mail, Phone, MapPin, Edit3, Clock, Calendar, HelpCircle, User, Eye, EyeOff, PenTool, Hash } from "lucide-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/shared/Button";

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
  signature?: string;
  helpDesk?: HelpDesk;
}

function HorizontalInfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 group py-4 border-b border-gray-100 border-dashed last:border-0 hover:bg-gray-50/50 transition-colors px-1">
      <span className="text-sm font-bold text-slate-800 w-44 shrink-0 uppercase tracking-tight">{label}:</span>
      <div className="text-sm font-bold text-slate-600 truncate flex-1 flex justify-end tracking-tight">
        {value || "—"}
      </div>
    </div>
  );
}

export default function SettingsProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { color } = useSelector((state: any) => state.theme);
  
  const [profile, setProfile] = useState<LibraryProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [showSignature, setShowSignature] = useState(false);

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
        <div style={{ borderColor: color, borderTopColor: "transparent" }} className="w-12 h-12 border-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  const tabs = [
    { name: "Profile", href: "/settings", icon: "solar:user-bold-duotone" },
    { name: "Personalization", href: "/settings/personalization", icon: "solar:palette-bold-duotone" },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen font-public-sans pb-20">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Settings"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Settings" },
          ]}
          actionNode={
            <Button
              onClick={() => router.push("/settings/edit")}
              variant="edit"
              size="md"
              className="px-8 font-bold rounded-xl shadow-lg active:scale-95"
            >
              Update Profile
            </Button>
          }
        />

        <div className="px-6 pt-0">
          {/* Settings Tabs */}
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-100 w-fit mb-8 shadow-sm">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                  }`}
                >
                  <Icon icon={tab.icon} width={18} />
                  {tab.name}
                </Link>
              );
            })}
          </div>

          <div className="space-y-8">
            
            {/* ── Hero Library Card ── */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]">
              <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="shrink-0 w-24 h-24 rounded-[28px] bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon="solar:library-bold-duotone" width={48} className="text-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{profile.name}</h1>
                    <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-200">Certified Organization</div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[14px] text-slate-500 font-bold">
                    <span className="flex items-center gap-2">
                      <Icon icon="solar:letter-bold-duotone" width={18} className="text-indigo-400" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <Icon icon="solar:phone-bold-duotone" width={18} className="text-indigo-400" />
                      {profile.phone || "No contact number"}
                    </span>
                  </div>
                </div>

                {/* Status Badge Group */}
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Infrastructure State</p>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100 uppercase tracking-widest">Active</span>
                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 uppercase tracking-widest">Cloud Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left Column: Contact & Signature */}
              <div className="lg:col-span-3 space-y-8">
                <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]">
                  <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Icon icon="solar:globus-bold-duotone" width={22} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Contact & Identity</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Official reachable addresses</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <HorizontalInfoRow label="Official Email" value={profile.email} />
                    <HorizontalInfoRow label="Primary Phone" value={profile.phone} />
                    <HorizontalInfoRow label="Physical Address" value={profile.address} />
                  </div>

                  {profile.signature && (
                    <div className="mt-10 pt-10 border-t border-gray-50 border-dashed">
                       <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <PenTool size={18} className="text-indigo-500" />
                              <span className="text-[14px] font-extrabold text-slate-800 uppercase tracking-tight">Authorized Signature</span>
                           </div>
                           <button 
                              onClick={() => setShowSignature(!showSignature)}
                              className="text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              {showSignature ? "Hide Signature" : "Reveal Signature"}
                            </button>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 flex items-center justify-center relative overflow-hidden group">
                          {showSignature ? (
                            <img src={profile.signature} alt="Signature" className="max-h-32 object-contain mix-blend-multiply transition-all duration-700 scale-110" />
                          ) : (
                            <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                               <Icon icon="solar:eye-closed-bold" width={48} />
                               <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Restricted Content</span>
                            </div>
                          )}
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Support Desk */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden h-full shadow-2xl">
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                  
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Icon icon="solar:help-bold-duotone" width={24} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Support Desk</h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Public Assistance Info</p>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Support Hotline</p>
                       <p className="text-2xl font-black tracking-tighter">{profile.helpDesk?.number || "Not Configured"}</p>
                       <p className="text-xs font-bold text-indigo-400 mt-1">{profile.helpDesk?.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Schedule</p>
                          <div className="flex items-center gap-2 text-[13px] font-bold">
                             <Clock size={16} className="text-indigo-400" />
                             <span>{profile.helpDesk?.hours || "N/A"}</span>
                          </div>
                       </div>
                       <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Holidays</p>
                          <div className="flex items-center gap-2 text-[13px] font-bold">
                             <Calendar size={16} className="text-amber-400" />
                             <span>{profile.helpDesk?.holidays?.length || 0} Days</span>
                          </div>
                       </div>
                    </div>

                    {profile.helpDesk?.address && (
                       <div className="bg-indigo-600/30 border border-indigo-400/20 rounded-2xl p-6">
                          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Desk Location</p>
                          <p className="text-sm font-bold leading-relaxed">{profile.helpDesk.address}</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
