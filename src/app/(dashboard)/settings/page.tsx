"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Building, Mail, Phone, MapPin, Edit3, Clock, Calendar, HelpCircle, User, Eye, EyeOff, PenTool, ShieldCheck, Palette, Bell } from "lucide-react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Button } from "@/components/shared/Button";
import { SimpleLoader } from "@/components/shared/SimpleLoader";

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
  const { color } = useSelector((state: any) => state.theme);
  
  const [profile, setProfile] = useState<LibraryProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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

  if (fetching) return <SimpleLoader text="Preparing Settings" />;
  if (!profile) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: "solar:user-id-bold-duotone" },
    { id: "branding", label: "Branding", icon: "solar:pen-new-square-bold-duotone" },
    { id: "personalization", label: "Personalization", icon: "solar:palette-bold-duotone" },
    { id: "security", label: "Security", icon: "solar:shield-keyhole-bold-duotone" },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen font-public-sans pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ─── Premium Profile Header Section ─── */}
        <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm">
           {/* Banner */}
           <div className="h-44 w-full relative">
              <div 
                className="absolute inset-0 opacity-90 transition-all duration-1000"
                style={{ 
                   background: `linear-gradient(135deg, ${color}cc, #0f172a), url('https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=2080&auto=format&fit=crop')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundBlendMode: 'overlay'
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
           </div>

           {/* User Info Bar */}
           <div className="px-8 pb-0 pt-3 relative flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 {/* Avatar */}
                 <div className="relative -mt-16 group">
                    <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-slate-900 group-hover:scale-105 transition-transform duration-500">
                      {profile.logo ? (
                        <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                           <Icon icon="solar:library-bold-duotone" width={64} />
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:scale-110 transition-transform text-slate-600">
                       <Icon icon="solar:camera-bold" width={18} />
                    </button>
                 </div>

                 {/* Names */}
                 <div className="pb-4">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none group flex items-center gap-3">
                        {profile.name}
                        <Icon icon="solar:verified-check-bold" width={22} className="text-blue-500" />
                    </h1>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{profile.email.split('@')[0]} Admin</p>
                 </div>
              </div>

              {/* Action */}
              <div className="pb-6">
                 <Button
                    onClick={() => router.push("/settings/edit")}
                    variant="edit"
                    className="rounded-2xl px-6 py-2.5 font-bold text-sm shadow-xl"
                 >
                    Edit Profile
                 </Button>
              </div>
           </div>

           {/* Tab Navigation - Shifted Right */}
           <div className="px-8 border-t border-gray-50 flex items-center justify-end gap-10">
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 py-4 transition-all relative group outline-none`}
                 >
                    <Icon 
                       icon={tab.icon} 
                       width={20} 
                       className={`transition-colors ${activeTab === tab.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} 
                    />
                    <span className={`text-[13.5px] font-bold tracking-tight transition-colors ${activeTab === tab.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>
                       {tab.label}
                    </span>
                    {activeTab === tab.id && (
                       <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                    )}
                 </button>
              ))}
           </div>
        </div>

        {/* ─── Content Area ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {activeTab === 'profile' && (
              <>
                 {/* Left: About / Contact */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                             <Icon icon="solar:info-square-bold-duotone" width={22} className="text-indigo-600" />
                          </div>
                          <div>
                             <h3 className="text-lg font-black text-slate-900 tracking-tight">Organization Profile</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public identity & contact</p>
                          </div>
                       </div>

                       <div className="space-y-1">
                          <HorizontalInfoRow label="Official Email" value={profile.email} />
                          <HorizontalInfoRow label="Contact Number" value={profile.phone} />
                          <HorizontalInfoRow label="Library Address" value={profile.address} />
                       </div>
                    </div>
                 </div>

                 {/* Right: Support Desk */}
                 <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-[24px] p-8 text-white relative overflow-hidden h-fit shadow-lg shadow-slate-200">
                       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                       
                       <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-xl font-black tracking-tight">Support Desk</h3>
                       </div>

                       <div className="relative z-10 space-y-7">
                          <p className="text-[13px] font-medium text-white/50 leading-relaxed italic">
                             Official contact point for all member queries and infrastructure assistance.
                          </p>

                          <div className="space-y-6">
                             {/* Phone */}
                             <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:phone-bold-duotone" width={18} className="text-white/80" />
                                </div>
                                <span className="text-[14px] font-medium text-white/80">
                                   Reachable at <span className="font-black text-white">{profile.helpDesk?.number || "88000-00000"}</span>
                                </span>
                             </div>

                             {/* Email */}
                             <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:letter-bold-duotone" width={18} className="text-white/80" />
                                </div>
                                <span className="text-[14px] font-medium text-white/80">
                                   {profile.helpDesk?.email || "help@library.com"}
                                </span>
                             </div>

                             {/* Hours */}
                             <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:clock-circle-bold-duotone" width={18} className="text-white/80" />
                                </div>
                                <span className="text-[14px] font-medium text-white/80">
                                   Open from <span className="font-black text-white">{profile.helpDesk?.hours || "09:00 AM - 09:00 PM"}</span>
                                </span>
                             </div>

                             {/* Location */}
                             <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:map-point-bold-duotone" width={18} className="text-white/80" />
                                </div>
                                <span className="text-[14px] font-medium text-white/80">
                                   Located at <span className="font-black text-white">{profile.helpDesk?.address?.split(',')[0] || "Main Wing"}</span>
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </>
           )}

           {activeTab === 'branding' && (
              <div className="col-span-1 lg:col-span-3 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {/* Identity Assets */}
                 <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Icon icon="solar:globus-bold-duotone" width={22} className="text-emerald-600" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Identity Assets</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage logo & signatures</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Logo Management */}
                       <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-slate-900 border-2 border-white shadow-sm overflow-hidden">
                                   <img src={profile.logo} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-800">Primary Logo</p>
                                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Main brand asset</p>
                                </div>
                             </div>
                             <Button variant="outline" className="text-[10px] px-3 py-1 font-black uppercase tracking-widest">Update</Button>
                          </div>
                       </div>

                       {/* Signature Section */}
                       <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Icon icon="solar:pen-new-square-bold-duotone" width={18} className="text-slate-500" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Authorized Signature</span>
                             </div>
                             <button 
                                onClick={() => setShowSignature(!showSignature)}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600"
                             >
                                {showSignature ? "Hide" : "Show"}
                             </button>
                          </div>
                          <div className="bg-white rounded-xl h-24 border border-gray-100 flex items-center justify-center p-4">
                             {showSignature ? (
                                <img src={profile.signature} className="h-full object-contain mix-blend-multiply" />
                             ) : (
                                <div className="flex flex-col items-center gap-2 opacity-20">
                                   <Icon icon="solar:eye-closed-bold-duotone" width={24} className="text-slate-300" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Hidden</span>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'personalization' && (
              <div className="col-span-1 lg:col-span-3">
                 <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                          <Icon icon="solar:palette-bold-duotone" width={22} className="text-pink-600" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Appearance & Theme</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customize your dashboard look</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                       <div 
                        onClick={() => router.push('/settings/personalization')}
                        className="group cursor-pointer p-8 rounded-[32px] border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all hover:shadow-xl"
                       >
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <Icon icon="solar:palet-2-bold-duotone" width={24} style={{ color }} />
                          </div>
                          <div className="space-y-3">
                             <div>
                                <h4 className="font-black text-slate-800 leading-none">Global Theme</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Brand & Primary Colors</p>
                             </div>
                             <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 w-fit">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Hex: {color}</span>
                             </div>
                             <p className="text-[12px] text-slate-500 font-bold leading-relaxed">Update your primary brand color, navigation layout, and global visual settings.</p>
                          </div>
                       </div>

                       <div className="group p-8 rounded-[32px] border border-gray-100 bg-gray-50/50 transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <Icon icon="solar:moon-bold-duotone" width={24} className="text-slate-700" />
                          </div>
                          <div className="space-y-3">
                             <div>
                                <h4 className="font-black text-slate-800 leading-none">Dark Mode</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">User Preference</p>
                             </div>
                             <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 w-fit">
                                <Icon icon="solar:sun-bold-duotone" width={14} className="text-amber-500" />
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-tight">
                                   Active Mode: Standard Light
                                </span>
                             </div>
                             <p className="text-[12px] text-slate-500 font-bold leading-relaxed tracking-tight">Experience a sleek dark interface. High-fidelity dark themes are optimized for low-light environments.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'security' && (
              <div className="col-span-1 lg:col-span-3">
                 <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Icon icon="solar:shield-keyhole-bold-duotone" width={22} className="text-emerald-600" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Security & Privacy</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage your credentials & access</p>
                       </div>
                    </div>

                    <div className="max-w-2xl pt-4">
                       <div className="p-6 rounded-2xl border border-dashed border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <Icon icon="solar:lock-password-bold-duotone" width={20} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800">Account Password</p>
                                <p className="text-xs font-bold text-slate-400">Change your login authentication password</p>
                             </div>
                          </div>
                          <Button variant="outline" className="text-xs font-bold px-4 py-2 hover:bg-slate-900 hover:text-white transition-all">Change</Button>
                       </div>
                    </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
