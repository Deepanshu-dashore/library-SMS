"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import toast from "react-hot-toast";
import { Palette, ChevronDown, Monitor, Sparkles, Check, Settings2, ShieldCheck, Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setColor, setDarkColor, setBgColor, setMode } from "@/store/themeSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const themes = [
  { name: "Emerald", textColor: "#00a76f", bgColor: "#00a76f14", Dark: "#007867" },
  { name: "Ocean", textColor: "#407BFF", bgColor: "#407BFF14", Dark: "#063ba7" },
  { name: "Sunset", textColor: "#ffab00", bgColor: "#ffab0014", Dark: "#b66816" },
  { name: "Royal", textColor: "#7635dc", bgColor: "#7635dc14", Dark: "#431a9e" },
  { name: "Rose", textColor: "#ff3030", bgColor: "#ff563014", Dark: "#b71833" },
  { name: "Sky", textColor: "#04b4f1", bgColor: "#04b4f114", Dark: "#0351ab" },
  { name: "Indigo", textColor: "#6950e8", bgColor: "#6950e814", Dark: "#3d2aa5" },
];

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  control: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

function SettingCard({ icon, title, description, control, isOpen, onToggle, children }: SettingCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div 
        className={`flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors ${isOpen ? 'bg-slate-50/50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-5">
          <div className="text-slate-500">
            {icon}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h3>
            {description && <p className="text-[12px] text-slate-500 font-semibold">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div onClick={(e) => e.stopPropagation()}>{control}</div>
          {children && (
             <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>
      {isOpen && children && (
        <div className="p-6 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PersonalizationPage() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { color: currentColor, mode } = useSelector((state: any) => state.theme);
  const [accentOpen, setAccentOpen] = useState(true);

  const handleThemeChange = (theme: any) => {
    dispatch(setColor(theme.textColor));
    dispatch(setDarkColor(theme.Dark));
    dispatch(setBgColor(theme.bgColor));
    localStorage.setItem("selectedTheme", JSON.stringify({
      color: theme.textColor,
      darkColor: theme.Dark,
      bgColor: theme.bgColor
    }));
    toast.success(`${theme.name} Theme Active`);
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    dispatch(setMode(newMode));
    toast.success(`Switched to ${newMode} Mode`);
  };

  const tabs = [
    { name: "Profile", href: "/settings", icon: "solar:user-bold-duotone" },
    { name: "Personalization", href: "/settings/personalization", icon: "solar:palette-bold-duotone" },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen font-public-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl mx-auto px-6">
        <PageHeader
          title="Personalization"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Personalization" },
          ]}
        />

        {/* Tabs Bar - Windows Style White */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit mb-10 shadow-sm">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-6 py-2.5 rounded-xl font-black text-[13px] transition-all flex items-center gap-2.5 ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-lg" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon icon={tab.icon} width={16} />
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">
          
          {/* Theme Mode Card */}
          <SettingCard 
            icon={<Monitor size={22} strokeWidth={2} />}
            title="Choose your mode"
            description="Change the colors that appear in the dashboard and your apps"
            control={
               <select 
                value={mode}
                onChange={(e) => handleModeChange(e.target.value as 'light' | 'dark')}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-[13px] font-bold px-4 py-2 rounded-lg outline-none focus:ring-4 focus:ring-slate-100 min-w-[130px] cursor-pointer"
               >
                 <option value="light">Light Mode</option>
                 <option value="dark">Dark Mode</option>
               </select>
            }
          />

          {/* Transparency Card */}
          <SettingCard 
            icon={<Sparkles size={22} strokeWidth={2} />}
            title="Transparency effects"
            description="Interface surfaces appear translucent (Glassmorphism)"
            control={
               <div className="flex items-center gap-4">
                  <span className="text-[13px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                  <div className="w-12 h-6 bg-slate-900 rounded-full relative shadow-lg">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
               </div>
            }
          />

          {/* Accent Color Card */}
          <SettingCard 
            icon={<Palette size={22} strokeWidth={2} />}
            title="Accent color"
            description="Choose a primary color that defines your workspace"
            control={
               <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[12px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">
                 Manual Preference
               </div>
            }
            isOpen={accentOpen}
            onToggle={() => setAccentOpen(!accentOpen)}
          >
             <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 py-6">
                {themes.map((theme) => {
                  const isSelected = currentColor === theme.textColor;
                  return (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeChange(theme)}
                      className={`group relative aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center border-2 ${
                        isSelected ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl scale-110' : 'border-transparent hover:border-slate-200 hover:scale-105 bg-slate-50'
                      }`}
                      title={theme.name}
                    >
                      <div 
                        style={{ backgroundColor: theme.textColor }} 
                        className="w-full h-full rounded-[14px] shadow-inner flex items-center justify-center overflow-hidden"
                      >
                         {isSelected && (
                           <div className="bg-white/30 backdrop-blur-md p-1.5 rounded-full ring-2 ring-white">
                             <Check size={18} className="text-white" strokeWidth={4} />
                           </div>
                         )}
                      </div>
                    </button>
                  );
                })}
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
               <Settings2 size={12} /> Colors are applied globally to all dashboard modules
             </p>
          </SettingCard>

          {/* Device Profile Card */}
          <SettingCard 
            icon={<ShieldCheck size={22} strokeWidth={2} />}
            title="Cloud synchronization"
            description="Keep your personalizations updated on all active sessions"
            control={
               <div className="w-12 h-6 bg-slate-100 rounded-full relative border border-slate-200">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full" />
               </div>
            }
          />

        </div>

        {/* Real-time High Fidelity Preview */}
        <div className="mt-12 p-10 rounded-[40px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative group overflow-hidden">
           <div 
             className="absolute -top-10 -right-10 transform group-hover:scale-110 transition-transform duration-1000 opacity-5 pointer-events-none"
             style={{ color: currentColor }}
           >
              <Palette size={280} />
           </div>
           
           <h4 className="text-[11px] font-black uppercase tracking-[0.45em] text-slate-400 mb-8">Personalization Preview</h4>
           <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">Accurate Visual <br/>Representation</h2>
              <div className="flex flex-wrap gap-4">
                 <div className="px-10 py-4 rounded-2xl text-[14px] font-black shadow-2xl transition-all active:scale-95" style={{ backgroundColor: currentColor, color: '#fff' }}>Primary Component</div>
                 <div className="px-10 py-4 rounded-2xl text-[14px] font-black bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all text-slate-700">Secondary Overlay</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
