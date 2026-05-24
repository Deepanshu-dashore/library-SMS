"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import toast from "react-hot-toast";
import { Palette, ChevronDown, Monitor, Sparkles, Check, Settings2, ShieldCheck } from "lucide-react";
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
  mode?: string;
}

function SettingCard({ icon, title, description, control, isOpen, onToggle, children, mode }: SettingCardProps) {
  return (
    <div className={`rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div
        className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${isOpen ? (mode === 'dark' ? 'bg-slate-750' : 'bg-slate-50/50') : ''} ${mode === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className={`${mode === 'dark' ? 'text-slate-405' : 'text-slate-500'}`}>
            {icon}
          </div>
          <div className="space-y-0.5">
            <h3 className={`text-sm font-semibold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
            {description && <p className={`text-xs font-normal ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>}
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
        <div className={`p-6 pt-2 border-t animate-in fade-in slide-in-from-top-2 duration-300 ${mode === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
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
    <div className={`min-h-screen font-public-sans pb-20 selection:bg-indigo-150 selection:text-indigo-900 ${mode === 'dark' ? 'bg-transparent' : 'bg-gray-50/50'}`}>
      <div className="max-w-4xl mx-auto px-6">
        <PageHeader
          title="Personalization"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Personalization" },
          ]}
        />

        {/* Tabs Bar - Premium Rounded */}
        <div className={`flex items-center gap-1 p-1 rounded-2xl border w-fit mb-8 shadow-sm ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${isActive
                  ? (mode === 'dark' ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30" : "bg-slate-900 text-white shadow-md")
                  : (mode === 'dark' ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")
                  }`}
              >
                <Icon icon={tab.icon} width={15} />
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">

          {/* Theme Mode Card */}
          <SettingCard
            icon={<Monitor size={20} strokeWidth={2} />}
            title="Choose your mode"
            mode={mode}
            description="Change the colors that appear in the dashboard and your apps"
            control={
              <select
                value={mode}
                onChange={(e) => handleModeChange(e.target.value as 'light' | 'dark')}
                className={`border text-xs font-semibold px-3 py-1.5 rounded-lg outline-none focus:ring-2 min-w-[130px] cursor-pointer ${mode === 'dark' ? 'bg-slate-700 border-slate-655 text-white focus:ring-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-slate-100'}`}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            }
          />

          {/* Transparency Card */}
          <SettingCard
            icon={<Sparkles size={20} strokeWidth={2} />}
            title="Transparency effects"
            mode={mode}
            description="Interface surfaces appear translucent (Glassmorphism)"
            control={
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active</span>
                <div className={`w-10 h-5.5 rounded-full relative p-0.5 transition-colors ${mode === 'dark' ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                  <div className="absolute right-0.5 top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-md" />
                </div>
              </div>
            }
          />

          {/* Accent Color Card */}
          <SettingCard
            icon={<Palette size={20} strokeWidth={2} />}
            title="Accent color"
            mode={mode}
            description="Choose a primary color that defines your workspace"
            control={
              <div className={`px-3 py-1 border rounded-lg text-[10px] font-semibold uppercase tracking-wider pointer-events-none ${mode === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                Manual Preference
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
                    className={`group relative aspect-square rounded-xl transition-all duration-300 flex items-center justify-center border-2 ${isSelected 
                      ? 'border-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950/40 shadow-md scale-105' 
                      : `border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:scale-102 ${mode === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'}`
                      }`}
                    title={theme.name}
                  >
                    <div
                      style={{ backgroundColor: theme.textColor }}
                      className="w-full h-full rounded-lg shadow-inner flex items-center justify-center overflow-hidden"
                    >
                      {isSelected && (
                        <div className="bg-white/30 backdrop-blur-md p-1.5 rounded-full ring-2 ring-white">
                          <Check size={14} className="text-white" strokeWidth={3.5} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3 flex items-center gap-2">
              <Settings2 size={12} /> Colors are applied globally to all dashboard modules
            </p>
          </SettingCard>

          {/* Device Profile Card */}
          <SettingCard
            icon={<ShieldCheck size={20} strokeWidth={2} />}
            title="Cloud synchronization"
            mode={mode}
            description="Keep your personalizations updated on all active sessions"
            control={
              <div className={`w-10 h-5.5 rounded-full relative p-0.5 border ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`absolute left-0.5 top-0.5 w-4.5 h-4.5 rounded-full ${mode === 'dark' ? 'bg-slate-600' : 'bg-slate-400'}`} />
              </div>
            }
          />

        </div>

        {/* Real-time High Fidelity Preview */}
        <div className={`mt-10 p-8 rounded-3xl border shadow-sm relative group overflow-hidden ${mode === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div
            className="absolute -top-10 -right-10 transform group-hover:scale-105 transition-transform duration-1000 opacity-5 pointer-events-none"
            style={{ color: currentColor }}
          >
            <Palette size={220} />
          </div>

          <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-6">Personalization Preview</h4>
          <div className="space-y-5">
            <h2 className={`text-2xl font-bold tracking-tight leading-snug ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Accurate Visual <br />Representation</h2>
            <div className="flex flex-wrap gap-3">
              <div className="px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 text-white" style={{ backgroundColor: currentColor }}>Primary Component</div>
              <div className={`px-6 py-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${mode === 'dark' ? 'bg-slate-700 border-slate-600 text-gray-200 hover:bg-slate-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'}`}>Secondary Overlay</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
