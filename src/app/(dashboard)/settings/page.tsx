"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Building, Mail, Phone, MapPin, Edit3, Clock, Calendar, HelpCircle, Palette, User, Eye, EyeOff, PenTool } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setColor, setDarkColor, setBgColor } from "@/store/themeSlice";

const themes = [
  {
    name: "#00a76f",
    textColor: "#00a76f",
    bgColor: "#00a76f14",
    Dark: "#007867",
  },
  { name: "Blue", textColor: "#407BFF", bgColor: "#407BFF14", Dark: "#063ba7" },
  {
    name: "Orange",
    textColor: "#ffab00",
    bgColor: "#ffab0014",
    Dark: "#b66816",
  },
  {
    name: "#7635dc",
    textColor: "#7635dc",
    bgColor: "#7635dc14",
    Dark: "#431a9e",
  },
  { name: "Red", textColor: "#ff3030", bgColor: "#ff563014", Dark: "#b71833" },
  {
    name: "#04b4f1",
    textColor: "#04b4f1",
    bgColor: "#04b4f114",
    Dark: "#0351ab",
  },
  {
    name: "#6950e8",
    textColor: "#6950e8",
    bgColor: "#6950e814",
    Dark: "#3d2aa5",
  },
];

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

export default function SettingsProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { color: currentColor, mode } = useSelector((state: any) => state.theme);
  
  const [profile, setProfile] = useState<LibraryProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "appearance">("profile");
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

  const handleThemeChange = (theme: any) => {
    dispatch(setColor(theme.textColor));
    dispatch(setDarkColor(theme.Dark));
    dispatch(setBgColor(theme.bgColor));
    localStorage.setItem("selectedTheme", JSON.stringify({
      ...JSON.parse(localStorage.getItem("selectedTheme") || "{}"),
      color: theme.textColor,
      darkColor: theme.Dark,
      bgColor: theme.bgColor
    }));
    toast.success("Theme updated successfully!");
  };

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
        title="Settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings" },
        ]}
        actionNode={
          activeTab === "profile" && (
            <Link
              href="/settings/edit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95 shadow-blue-500/10"
            >
              <Edit3 className="w-4 h-4 stroke-[2.5px]" />
              Edit Profile
            </Link>
          )
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "profile" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "appearance" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Palette className="w-4 h-4" />
          Appearance
        </button>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === "profile" ? (
          <>
            {/* Profile Hero Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 ring-1 ring-gray-100 overflow-hidden relative group">
              <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-br from-blue-600/5 to-purple-600/5 border-b border-gray-100" />
              
              <div className="p-10 pt-16 relative">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                  <div className="w-40 h-40 rounded-xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center border-4 border-white overflow-hidden shrink-0 z-10 p-2">
                    {profile.logo ? (
                      <img src={profile.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building className="w-20 h-20 text-blue-200" />
                    )}
                  </div>
                  <div className="text-center md:text-left mb-4">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{profile.name}</h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-gray-400 font-bold text-[11px] tracking-widest uppercase">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg ring-1 ring-blue-100">Administrator</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg ring-1 ring-gray-100">Official Account</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Main Info Column */}
              <div className="lg:col-span-3 space-y-8">
                {/* Global Contact Info */}
                <div className="bg-white rounded-xl p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-10 flex items-center gap-2">
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

                    {profile.signature && (
                      <div className="flex items-start gap-6 border-t border-gray-50 pt-10">
                        <div className="w-14 h-14 bg-purple-50/50 text-purple-600 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm">
                          <PenTool size={22} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-4 w-full">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Official Signature</p>
                            <button 
                              onClick={() => setShowSignature(!showSignature)}
                              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-blue-600 flex items-center gap-2 text-xs font-bold"
                            >
                              {showSignature ? <EyeOff size={16} /> : <Eye size={16} />}
                              {showSignature ? "Hide" : "Show"}
                            </button>
                          </div>
                          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center relative overflow-hidden group">
                            <img 
                              src={profile.signature} 
                              alt="Signature" 
                              className={`max-h-24 object-contain transition-all duration-500 mix-blend-multiply ${!showSignature ? "blur-md opacity-20 scale-95" : "blur-0 opacity-100 scale-100"}`}
                            />
                            {!showSignature && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm border border-blue-600/20">Hidden for Privacy</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Help Desk Dashboard Column */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-900 rounded-xl p-8 shadow-xs text-white overflow-hidden relative group h-full">
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
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Palette size={16} strokeWidth={3} /> Color Preset
                </h3>
                {currentColor !== "#00a76f" && (
                  <button
                    onClick={() => {
                      dispatch(setColor("#00a76f"));
                      dispatch(setDarkColor("#007867"));
                      dispatch(setBgColor("#00a76f14"));
                      toast.success("Reset to default theme");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                    title="Reset to default"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {themes.map((theme, index) => (
                  <button
                    key={theme.name}
                    onClick={() => handleThemeChange(theme)}
                    style={{
                      backgroundColor:currentColor === theme.textColor ? theme.bgColor : (mode === 'light' ? '#f9fafb' : '#111827'),
                      borderColor: currentColor === theme.textColor ? `${theme.textColor}40` : 'transparent'
                    }}
                    className={`h-24 flex flex-col cursor-pointer justify-center items-center rounded-2xl transition-all duration-300 border-2 ${currentColor === theme.textColor ? "shadow-lg scale-105" : "hover:scale-102"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={32}
                      height={32}
                      viewBox="0 0 24 24"
                      className="mb-2"
                    >
                      <path
                        fill={theme.textColor}
                        fillRule="evenodd"
                        d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828S6.239 2 10.03 2c.606 0 1.091 0 1.5.017q-.02.12-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22"
                        clipRule="evenodd"
                        opacity={0.5}
                      ></path>
                      <path
                        fill={theme.textColor}
                        d="M6 13.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm5.51-14.99l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"
                      ></path>
                    </svg>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${currentColor === theme.textColor ? "text-gray-900" : "text-gray-400"}`}>Preset {index + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-xs border border-gray-100 ring-1 ring-gray-100 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 ring-1 ring-blue-100">
                  <Palette size={32} />
               </div>
               <h3 className="text-xl font-black text-gray-900 mb-2">Dark Mode & Layout</h3>
               <p className="text-sm text-gray-500 font-medium mb-6">
                 Additional customization options like Dark mode, Nav direction, and Font settings are available in the quick access panel.
               </p>
               <button 
                onClick={() => toast.success("Use the header buttons for quick toggles!")}
                className="text-blue-600 font-bold text-sm bg-blue-50/50 px-6 py-2 rounded-full border border-blue-100"
               >
                 Toggles Available in Header
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
