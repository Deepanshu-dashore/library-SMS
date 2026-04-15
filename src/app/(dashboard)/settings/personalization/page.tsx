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
    <div className="bg-[#ffffff05] backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300">
      <div 
        className={`flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.03] transition-colors ${isOpen ? 'bg-white/[0.02]' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-5">
          <div className="text-slate-400">
            {icon}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-semibold text-white tracking-tight">{title}</h3>
            {description && <p className="text-[12px] text-slate-400 font-medium">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div onClick={(e) => e.stopPropagation()}>{control}</div>
          {children && (
             <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>
      {isOpen && children && (
        <div className="p-6 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
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
    toast.success(`${theme.name} Theme active`);
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    dispatch(setMode(newMode));
    toast.success(`Switched to ${newMode} mode`);
  };

  const tabs = [
    { name: "Profile", href: "/settings", icon: "solar:user-bold-duotone" },
    { name: "Personalization", href: "/settings/personalization", icon: "solar:palette-bold-duotone" },
  ];

  return (
    <div className="bg-[#0f1115] min-h-screen font-public-sans pb-20 text-white selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6">
        <PageHeader
          title="Personalization"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Personalization" },
          ]}
          className="text-white"
        />

        {/* Tabs Bar - Windows Style */}
        <div className="flex items-center gap-1 bg-[#ffffff05] p-1.5 rounded-2xl border border-white/10 w-fit mb-10 shadow-inner">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-6 py-2 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2.5 ${
                  isActive 
                    ? "bg-white text-slate-900 shadow-xl" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon icon={tab.icon} width={16} />
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="space-y-3">
          
          {/* Theme Mode Card */}
          <SettingCard 
            icon={<Monitor size={22} strokeWidth={1.5} />}
            title="Choose your mode"
            description="Change the colors that appear in the dashboard and your apps"
            control={
               <select 
                value={mode}
                onChange={(e) => handleModeChange(e.target.value as 'light' | 'dark')}
                className="bg-[#1c1e26] border border-white/10 text-white text-[13px] font-semibold px-4 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 min-w-[120px] cursor-pointer"
               >
                 <option value="light">Light</option>
                 <option value="dark">Dark</option>
               </select>
            }
          />

          {/* Transparency Card */}
          <SettingCard 
            icon={<Sparkles size={22} strokeWidth={1.5} />}
            title="Transparency effects"
            description="Windows and surfaces appear translucent"
            control={
               <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-slate-300">On</span>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative shadow-inner">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
               </div>
            }
          />

          {/* Accent Color Card (The one the user wants open) */}
          <SettingCard 
            icon={<Palette size={22} strokeWidth={1.5} />}
            title="Accent color"
            control={
               <div className="px-4 py-1.5 bg-[#1c1e26] border border-white/10 rounded-lg text-[13px] font-semibold text-slate-300 pointer-events-none">
                 Manual
               </div>
            }
            isOpen={accentOpen}
            onToggle={() => setAccentOpen(!accentOpen)}
          >
             <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 py-4">
                {themes.map((theme) => {
                  const isSelected = currentColor === theme.textColor;
                  return (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeChange(theme)}
                      className={`group relative aspect-square rounded-xl transition-all duration-300 flex items-center justify-center border-2 ${
                        isSelected ? 'border-white ring-4 ring-white/10 shadow-2xl scale-105' : 'border-transparent hover:border-white/20 hover:scale-105'
                      }`}
                      title={theme.name}
                    >
                      <div 
                        style={{ backgroundColor: theme.textColor }} 
                        className="w-full h-full rounded-[10px] shadow-lg flex items-center justify-center overflow-hidden"
                      >
                         {isSelected && (
                           <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full ring-1 ring-white/40">
                             <Check size={16} className="text-white" strokeWidth={4} />
                           </div>
                         )}
                      </div>
                    </button>
                  );
                })}
             </div>
             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-4 flex items-center gap-2">
               <Settings2 size={12} /> Custom colors are synced across your library profile
             </p>
          </SettingCard>

          {/* Device Profile Card */}
          <SettingCard 
            icon={<ShieldCheck size={22} strokeWidth={1.5} />}
            title="Sync settings"
            description="Keep your personalizations updated on all active sessions"
            control={
               <div className="w-10 h-5 bg-white/10 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-slate-500 rounded-full" />
               </div>
            }
          />

        </div>

        {/* Dynamic Theme Preview Box */}
        <div className="mt-12 p-8 rounded-[32px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 relative group overflow-hidden">
           <div 
             className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-700 opacity-20 pointer-events-none"
             style={{ color: currentColor }}
           >
              <Palette size={120} />
           </div>
           
           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Real-time Preview</h4>
           <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter" style={{ color: currentColor }}>Modernizing the Workplace</h2>
              <div className="flex gap-4">
                 <div className="px-6 py-2 rounded-xl text-sm font-bold shadow-xl transition-colors" style={{ backgroundColor: currentColor, color: '#fff' }}>Primary Action</div>
                 <div className="px-6 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">Secondary Interface</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
