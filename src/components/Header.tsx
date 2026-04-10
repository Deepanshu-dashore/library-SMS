"use client";
import React, { useState } from "react";
import Link from "next/link";
import ModeToggle from "./shared/ModeToggle";
import SettingsDrawer from "./shared/SettingsDrawer";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { MENU_ITEMS } from "@/constants/menuItems";
import toast from "react-hot-toast";

export default function Header() {
  const { mode, activeNavStyle, color } = useSelector((state: any) => state.theme);
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  };

  const isTopNav = activeNavStyle === "nav-top";

  // Function to get page title from pathname
  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
  };

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative z-10 w-full flex flex-col border-b backdrop-blur-md bg-opacity-80 transition-all duration-300`}
      style={{ 
        backgroundColor: "var(--bg)", 
        borderColor: "var(--border)",
        color: "var(--text)"
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          {isTopNav && (
            <div className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-tr from-blue-600 to-purple-600 flex-shrink-0" />
              <h1 className="text-lg font-extrabold hidden lg:block">Library SMS</h1>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-[var(--gray-500)]">
            <Icon icon="lucide:layout-dashboard" className="w-4 h-4" />
            <span>/</span>
            <span className="font-semibold text-[var(--text)]">
              {getPageTitle(pathname)}
            </span>
          </div>
        </div>

        {/* Top Nav Items - Only in Top Mode */}
        {isTopNav && (
          <nav className="hidden xl:flex items-center gap-1">
            {MENU_ITEMS.map((item: any, index: number) => (
              <Link 
                key={index}
                href={item.path || "#"}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-2`}
                style={{
                  backgroundColor: isActiveRoute(item.path) ? `${color}15` : "transparent",
                  color: isActiveRoute(item.path) ? color : "var(--gray-500)",
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {/* Search Bar Placeholder */}
          {/* <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-[var(--gray-50)] dark:bg-[var(--gray-900)] border-[var(--border)] group transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20">
            <Icon icon="lucide:search" className="w-4 h-4 text-[var(--gray-400)]" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-xs w-24 lg:w-48 placeholder:text-[var(--gray-400)]"
            />
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--gray-400)] bg-[var(--gray-100)] dark:bg-[var(--gray-800)]">⌘K</span>
          </div> */}

          <div className="h-6 w-px bg-[var(--border)] mx-1" />

          <div className="flex items-center gap-2">
            {/* <button className="p-2 rounded-full hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)] transition-colors relative">
              <Icon icon="lucide:bell" className="w-5 h-5 text-[var(--gray-500)]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg)]" />
            </button> */}
            
            <ModeToggle />
            
            <div className="h-6 w-px bg-[var(--border)] mx-1" />
            
            {/* <SettingsDrawer /> */}

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-transparent group-hover:border-blue-500/50 transition-all">
                  AD
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none">Admin</p>
                  <p className="text-[10px] text-[var(--gray-500)]">Super Admin</p>
                </div>
                <Icon 
                  icon="lucide:chevron-down" 
                  className={`w-4 h-4 text-[var(--gray-400)] transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} 
                />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    {/* Invisible Click-away Layer */}
                    <div 
                      className="fixed inset-0 z-0" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-5 w-56 rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden z-10 backdrop-blur-xl"
                      style={{ 
                        backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(28, 37, 46, 0.9)",
                      }}
                    >
                      <div className="p-4 border-b border-[var(--border)]">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-[var(--text)] truncate">admin@library.com</p>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text)]"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                            <Icon icon="lucide:user" className="w-4 h-4" />
                          </div>
                          View Profile
                        </Link>
                        
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text)]"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                            <Icon icon="lucide:settings" className="w-4 h-4" />
                          </div>
                          Account Settings
                        </Link>
                      </div>

                      <div className="p-2 border-t border-[var(--border)]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                            <Icon icon="lucide:log-out" className="w-4 h-4" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
