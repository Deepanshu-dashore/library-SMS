"use client";
import React from "react";
import ModeToggle from "./shared/ModeToggle";
import SettingsDrawer from "./shared/SettingsDrawer";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function Header() {
  const { mode } = useSelector((state: any) => state.theme);
  const pathname = usePathname();

  // Function to get page title from pathname
  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative z-10 w-full flex items-center justify-between px-6 py-3 border-b backdrop-blur-md bg-opacity-80 transition-all duration-300`}
      style={{ 
        backgroundColor: "var(--bg)", 
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--gray-500)]">
          <Icon icon="lucide:layout-dashboard" className="w-4 h-4" />
          <span>/</span>
          <span className="font-semibold text-[var(--text)]">
            {getPageTitle(pathname)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar Placeholder */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-[var(--gray-50)] dark:bg-[var(--gray-900)] border-[var(--border)] group transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20">
          <Icon icon="lucide:search" className="w-4 h-4 text-[var(--gray-400)]" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-xs w-48 placeholder:text-[var(--gray-400)]"
          />
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--gray-400)] bg-[var(--gray-100)] dark:bg-[var(--gray-800)]">⌘K</span>
        </div>

        <div className="h-6 w-px bg-[var(--border)] mx-1" />

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)] transition-colors relative">
            <Icon icon="lucide:bell" className="w-5 h-5 text-[var(--gray-500)]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg)]" />
          </button>
          
          <ModeToggle />
          
          <div className="h-6 w-px bg-[var(--border)] mx-1" />
          
          <SettingsDrawer />

          <button className="flex items-center gap-2 pl-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-transparent group-hover:border-blue-500/50 transition-all">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none">Admin</p>
              <p className="text-[10px] text-[var(--gray-500)]">Super Admin</p>
            </div>
            <Icon icon="lucide:chevron-down" className="w-4 h-4 text-[var(--gray-400)] group-hover:text-[var(--text)] transition-colors" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
