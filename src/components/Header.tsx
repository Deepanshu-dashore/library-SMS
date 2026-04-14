"use client";
import React, { useState } from "react";
import Link from "next/link";
import ModeToggle from "./shared/ModeToggle";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { MENU_ITEMS } from "@/constants/menuItems";
import toast from "react-hot-toast";
import { setMode } from "@/store/themeSlice";
import { logoutUser } from "@/store/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { mode, activeNavStyle, color } = useSelector((state: any) => state.theme);
  const { currentUser } = useSelector((state: any) => state.user);
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        dispatch(logoutUser());
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

  const MenuItem = ({ icon, label, href, onClick, className = "", rightElement }: any) => (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between w-full px-5 py-2.5 transition-all hover:bg-gray-500/5 group ${className}`}
    >
      <div className="flex items-center gap-4">
        <Icon icon={icon} className="w-5 h-5 text-[var(--gray-500)] group-hover:text-[var(--text)] transition-colors" />
        <span className="text-sm font-medium text-[var(--gray-800)]">{label}</span>
      </div>
      {rightElement}
    </Link>
  );

  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    // Standardize "Users" to "Members"
    if (segments[0] === "users") {
      if (segments.length === 1) return "Member Management";
      if (segments.length === 2 && !["create", "trash"].includes(segments[1])) return "Member Details";
      if (segments[1] === "create") return "Add Member";
      if (segments[1] === "trash") return "Recycle Bin";
      if (segments[2] === "edit") return "Edit Member";
    }

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
                <Icon icon={item.icon} className="w-4 h-4" />
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
                className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--gray-200)] transition-all duration-200 group active:scale-95 shadow-xs"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm">
                  <img 
                    src={currentUser?.logo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || "User"}`} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text)]">{currentUser?.name || "User"}</span>
                </div>
                <Icon 
                  icon="lucide:chevron-down" 
                  className={`w-4 h-4 text-[var(--gray-500)] transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} 
                />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setShowUserMenu(false)} />
                    
                    <motion.div
                    onMouseDown={() => setShowUserMenu(false)}
                    onMouseLeave={()=>setShowUserMenu(false)}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 mt-3 w-64 rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden z-100"
                      style={{ 
                        backgroundColor: mode === "light" ? "#ffffff" : "#1C1C1E",
                      }}
                    >
                      {/* Dropdown Header */}
                      <div className="px-5 py-2.5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={currentUser?.logo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || "User"}`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-0.5">
                            <h3 className="text-base font-medium text-[var(--text)]">{currentUser?.name || "User"}</h3>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">{currentUser?.email || "user@email.com"}</p>
                        </div>
                      </div>

                      <div className="h-px bg-[var(--border)]" />

                      <div className="p-0">
                        <MenuItem 
                          icon="lucide:settings-2" 
                          label="Profile Settings" 
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <MenuItem 
                          icon="lucide:help-circle" 
                          label="Help Center" 
                          href="/help-center"
                          onClick={() => setShowUserMenu(false)}
                        />
                        
                        {/* <button
                          onClick={() => dispatch(setMode(mode === "light" ? "dark" : "light"))}
                          className="flex items-center justify-between w-full px-5 py-3.5 transition-all hover:bg-gray-500/5 group"
                        >
                          <div className="flex items-center gap-4">
                            <Icon 
                              icon={mode === "light" ? "lucide:moon" : "lucide:sun"} 
                              className="w-5 h-5 text-[var(--gray-500)] group-hover:text-[var(--text)] transition-colors" 
                            />
                            <span className="text-sm font-medium text-[var(--text)]">
                              {mode === "light" ? "Dark Mode" : "Light Mode"}
                            </span>
                          </div>
                        </button> */}
                        
                        <div className="h-px bg-[var(--border)] my-2" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-4 w-full cursor-pointer p-2 pt-0 transition-all hover:bg-gray-500/5 group"
                        >
                          <div className="flex items-center gap-4 w-full group-hover:bg-red-50 border border-transparent group-hover:border-red-100/90 p-2 px-5 rounded-md">
                            <Icon icon="lucide:log-out" className="w-5 h-5 text-[var(--gray-500)] group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-medium text-[var(--text)] group-hover:text-red-500">Sign Out</span>
                          </div>
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
