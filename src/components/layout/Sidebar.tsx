"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/constants/menuItems";
import { LogOut, ChevronRight } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-[#0a0a0a] text-[#ededed] border-r border-[#262626] transition-all duration-300 ease-in-out">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-linear-to-tr from-blue-600 to-purple-600 rounded-lg" />
        <h1 className="text-xl font-bold tracking-tight">Library SMS</h1>
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
                  ? "bg-blue-600/10 text-blue-500 font-medium shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                  : "text-[#a3a3a3] hover:bg-[#171717] hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-blue-500" : "group-hover:text-white"} />
              <span className="flex-1">{item.title}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#262626]">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-[#a3a3a3] hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 group">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
