"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
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

function HorizontalInfoRow({ label, value, mode }: { label: string; value?: React.ReactNode; mode?: string }) {
  return (
    <div className={`flex items-center gap-2 group py-4 border-b border-dashed last:border-0 transition-colors px-1 ${mode === 'dark' ? 'border-slate-700 hover:bg-slate-800/20' : 'border-gray-100 hover:bg-gray-50/50'}`}>
      <span className={`text-xs font-semibold w-40 shrink-0 uppercase tracking-wider ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{label}:</span>
      <div className={`text-sm font-semibold truncate flex-1 flex justify-end tracking-tight ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
        {value || "—"}
      </div>
    </div>
  );
}

export default function SettingsProfilePage() {
  const router = useRouter();
  const { color, mode } = useSelector((state: any) => state.theme);
  
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
    <div className={`min-h-screen font-public-sans ${mode === 'dark' ? 'bg-transparent' : 'bg-gray-50/50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ─── Premium Profile Header Section ─── */}
        <div className={`rounded-2xl overflow-hidden border shadow-sm ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
           {/* Banner */}
           <div className="h-36 w-full relative">
              <div 
                className="absolute inset-0 opacity-90 transition-all duration-1000"
                style={{ 
                   background: `url('/Banner.webp')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundBlendMode: 'overlay'
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
           </div>

           {/* User Info Bar */}
           <div className="px-8 pb-0 pt-3 relative flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 {/* Avatar */}
                 <div className="relative -mt-14 group">
                    <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-slate-900 group-hover:scale-105 transition-transform duration-500">
                      {profile.logo ? (
                        <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                           <Icon icon="solar:library-bold-duotone" width={56} />
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-1 right-1 p-1.5 bg-white rounded-full shadow-md border border-gray-100 hover:scale-110 transition-transform text-slate-600">
                       <Icon icon="solar:camera-bold" width={16} />
                    </button>
                 </div>

                 {/* Names */}
                 <div className="pb-3">
                    <h1 className={`text-xl font-bold tracking-tight leading-tight flex items-center gap-2 ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {profile.name}
                    </h1>
                    <p className={`text-xs font-semibold mt-1 capitalize ${mode === 'dark' ? 'text-gray-400' : 'text-slate-550'}`}>({profile.email.split('@')[0]} Admin)</p>
                 </div>
              </div>

              {/* Action */}
              <div className="pb-4">
                 <button
                    onClick={() => router.push("/settings/edit")}
                    className="rounded-xl px-5 py-2 font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 border bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-md"
                 >
                    Edit Profile
                 </button>
              </div>
           </div>

           {/* Tab Navigation - Shifted Right */}
           <div className={`px-8 border-t flex items-center justify-end gap-8 ${mode === 'dark' ? 'border-slate-700' : 'border-gray-50'}`}>
              {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 transition-all relative group outline-none`}
                 >
                    <Icon 
                       icon={tab.icon} 
                       width={18} 
                       className={`transition-colors ${activeTab === tab.id ? (mode === 'dark' ? "text-white" : "text-slate-900") : (mode === 'dark' ? "text-gray-500 group-hover:text-gray-300" : "text-slate-400 group-hover:text-slate-600")}`} 
                    />
                    <span className={`text-xs font-semibold tracking-tight transition-colors ${activeTab === tab.id ? (mode === 'dark' ? "text-white" : "text-slate-900") : (mode === 'dark' ? "text-gray-500 group-hover:text-gray-300" : "text-slate-400 group-hover:text-slate-600")}`}>
                       {tab.label}
                    </span>
                    {activeTab === tab.id && (
                       <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${mode === 'dark' ? 'bg-white' : 'bg-slate-900'}`} />
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
                    <div className={`rounded-2xl p-8 border shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-605'}`}>
                             <Icon icon="solar:info-square-bold-duotone" width={20} />
                          </div>
                          <div>
                             <h3 className={`text-base font-semibold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Organization Profile</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public identity & contact</p>
                          </div>
                       </div>

                       <div className="space-y-1">
                          <HorizontalInfoRow label="Official Email" value={profile.email} mode={mode} />
                          <HorizontalInfoRow label="Contact Number" value={profile.phone} mode={mode} />
                          <HorizontalInfoRow label="Library Address" value={profile.address} mode={mode} />
                       </div>
                    </div>
                 </div>

                 {/* Right: Support Desk */}
                 <div className="lg:col-span-1">
                    <div className={`rounded-2xl p-8 text-white relative overflow-hidden h-fit shadow-md ${mode === 'dark' ? 'bg-slate-900 shadow-none border border-slate-700' : 'bg-slate-900 shadow-slate-205'}`}>
                       <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
                       
                       <div className="flex items-center gap-3 mb-5">
                          <h3 className="text-base font-bold tracking-tight">Support Desk</h3>
                       </div>

                       <div className="relative z-10 space-y-6">
                          <p className="text-xs font-normal text-white/60 leading-relaxed italic">
                             Official contact point for all member queries and infrastructure assistance.
                          </p>

                          <div className="space-y-5">
                             {/* Phone */}
                             <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:phone-bold-duotone" width={15} className="text-white/80" />
                                </div>
                                <span className="text-xs font-medium text-white/80">
                                   Reachable at <span className="font-semibold text-white">{profile.helpDesk?.number || "88000-00000"}</span>
                                </span>
                             </div>

                             {/* Email */}
                             <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:letter-bold-duotone" width={15} className="text-white/80" />
                                </div>
                                <span className="text-xs font-medium text-white/80">
                                   {profile.helpDesk?.email || "help@library.com"}
                                </span>
                             </div>

                             {/* Hours */}
                             <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:clock-circle-bold-duotone" width={15} className="text-white/80" />
                                </div>
                                <span className="text-xs font-medium text-white/80">
                                   Open <span className="font-semibold text-white">{profile.helpDesk?.hours || "09:00 AM - 09:00 PM"}</span>
                                </span>
                             </div>

                             {/* Location */}
                             <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-colors">
                                   <Icon icon="solar:map-point-bold-duotone" width={15} className="text-white/80" />
                                </div>
                                <span className="text-xs font-medium text-white/80">
                                   Located at <span className="font-semibold text-white">{profile.helpDesk?.address?.split(',')[0] || "Main Wing"}</span>
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
                 <div className={`rounded-2xl p-8 border shadow-sm ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Icon icon="solar:globus-bold-duotone" width={20} className="text-emerald-600" />
                       </div>
                       <div>
                          <h3 className={`text-base font-semibold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Identity Assets</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage logo & signatures</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Logo Management */}
                       <div className="space-y-4">
                          <div className={`p-4 rounded-xl border flex items-center justify-between ${mode === 'dark' ? 'bg-slate-700/30 border-slate-650' : 'bg-gray-50 border-gray-100'}`}>
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-900 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                   {profile.logo ? (
                                     <img src={profile.logo} className="w-full h-full object-cover" />
                                   ) : (
                                     <Icon icon="solar:library-bold-duotone" className="text-slate-600" width={28} />
                                   )}
                                </div>
                                <div>
                                   <p className={`text-sm font-semibold ${mode === 'dark' ? 'text-white' : 'text-slate-805'}`}>Primary Logo</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Main brand asset</p>
                                </div>
                             </div>
                             <button
                               onClick={() => router.push("/settings/edit")}
                               className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border ${mode === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-205 text-slate-600 hover:bg-slate-50'}`}
                             >
                               Update
                             </button>
                          </div>
                       </div>

                       {/* Signature Section */}
                       <div className={`border rounded-xl p-5 space-y-3 ${mode === 'dark' ? 'bg-slate-700/30 border-slate-650' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Icon icon="solar:pen-new-square-bold-duotone" width={16} className="text-slate-500" />
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Authorized Signature</span>
                             </div>
                             <button 
                                onClick={() => setShowSignature(!showSignature)}
                                className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                             >
                                {showSignature ? "Hide" : "Show"}
                             </button>
                          </div>
                          <div className={`rounded-xl h-20 border flex items-center justify-center p-3 ${mode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}>
                             {showSignature ? (
                                <img src={profile.signature} className={`h-full object-contain ${mode === 'dark' ? '' : 'mix-blend-multiply'}`} />
                             ) : (
                                <div className="flex flex-col items-center gap-1 opacity-20">
                                   <Icon icon="solar:eye-closed-bold-duotone" width={20} className="text-slate-400" />
                                   <span className="text-[9px] font-semibold uppercase tracking-widest">Hidden</span>
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
                 <div className={`rounded-2xl p-8 border shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                          <Icon icon="solar:palette-bold-duotone" width={20} className="text-pink-600" />
                       </div>
                       <div>
                          <h3 className={`text-base font-semibold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Appearance & Theme</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customize your dashboard look</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                       <div 
                         onClick={() => router.push('/settings/personalization')}
                         className={`group cursor-pointer p-6 rounded-2xl border transition-all ${mode === 'dark' ? 'border-slate-700 bg-slate-700/30 hover:bg-slate-700 hover:border-slate-600' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-205 hover:shadow-sm'}`}
                       >
                          <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${mode === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                             <Icon icon="solar:palet-2-bold-duotone" width={20} style={{ color }} />
                          </div>
                          <div className="space-y-2">
                             <div>
                                <h4 className={`font-semibold leading-none text-base ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Global Theme</h4>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5">Brand & Primary Colors</p>
                             </div>
                             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit ${mode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-100 text-slate-600'}`}>
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs font-semibold uppercase tracking-tight">Hex: {color}</span>
                             </div>
                             <p className={`text-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'} font-medium leading-relaxed`}>Update your primary brand color, navigation layout, and global visual settings.</p>
                          </div>
                       </div>

                       <div 
                         onClick={() => router.push('/settings/personalization')}
                         className={`group cursor-pointer p-6 rounded-2xl border transition-all ${mode === 'dark' ? 'border-slate-700 bg-slate-700/30 hover:bg-slate-700 hover:border-slate-600' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-205 hover:shadow-sm'}`}
                       >
                          <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${mode === 'dark' ? 'bg-slate-800 text-indigo-400' : 'bg-white text-slate-750'}`}>
                             <Icon icon="solar:moon-bold-duotone" width={20} />
                          </div>
                          <div className="space-y-2">
                             <div>
                                <h4 className={`font-semibold leading-none text-base ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Appearance Mode</h4>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5">User Preference</p>
                             </div>
                             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit ${mode === 'dark' ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-white border-gray-100 text-emerald-600'}`}>
                                <Icon icon={mode === 'dark' ? "solar:moon-bold-duotone" : "solar:sun-bold-duotone"} width={13} className={mode === 'dark' ? "text-indigo-400" : "text-amber-500"} />
                                <span className="text-xs font-semibold uppercase tracking-tight">
                                   Active Mode: {mode === 'dark' ? 'Premium Dark' : 'Standard Light'}
                                </span>
                             </div>
                             <p className={`text-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'} font-medium leading-relaxed tracking-tight`}>Experience a sleek dark interface. High-fidelity dark themes are optimized for low-light environments.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'security' && (
              <div className="col-span-1 lg:col-span-3">
                 <div className={`rounded-2xl p-8 border shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Icon icon="solar:shield-keyhole-bold-duotone" width={20} className="text-emerald-600" />
                       </div>
                       <div>
                          <h3 className={`text-base font-semibold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security & Privacy</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage your credentials & access</p>
                       </div>
                    </div>

                    <div className="max-w-2xl pt-2">
                       <div className={`p-5 rounded-xl border border-dashed flex items-center justify-between ${mode === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-400'}`}>
                                <Icon icon="solar:lock-password-bold-duotone" width={18} />
                             </div>
                             <div>
                                <p className={`text-sm font-semibold ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Account Password</p>
                                <p className="text-xs font-medium text-slate-400">Change your login authentication password</p>
                             </div>
                          </div>
                          <button
                            onClick={() => toast.success("Password reset link dispatched")}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg border hover:bg-slate-900 hover:text-white transition-all ${mode === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white'}`}
                          >
                            Change
                          </button>
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
