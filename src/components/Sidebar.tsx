"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/constants/menuItems";
import { LogOut, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error("Logout error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full w-64 flex-none bg-white text-gray-900 border-r border-gray-100 ease-in-out">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-linear-to-tr from-blue-600 to-purple-600 rounded-lg shadow-sm" />
        <h1 className="text-xl font-bold tracking-tight text-gray-800">Library SMS</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900"} />
              <span className="flex-1">{item.title}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

