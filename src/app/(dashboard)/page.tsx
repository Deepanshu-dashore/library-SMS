"use client";

import React from "react";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Calendar,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

const STATS = [
  { label: "Total Students", value: "1,284", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Books Issued", value: "452", change: "+5%", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Revenue", value: "$12,450", change: "+18%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Active Sessions", value: "86", change: "+24%", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Main Dashboard</h1>
        <p className="text-gray-500 text-lg font-medium">Welcome back! Manage your library's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden shadow-sm">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl opacity-50 -mr-8 -mt-8 transition-opacity`} />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon size={28} />
              </div>
              <span className="flex items-center text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full shadow-sm">
                {stat.change}
                <ArrowUpRight size={14} className="ml-0.5" />
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={18} />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-6 p-5 hover:bg-gray-50 rounded-3xl transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                  <Calendar size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 font-bold text-base leading-tight">New Seat Allocated - Seat #42</h4>
                  <p className="text-gray-400 text-sm mt-1 font-medium italic">Allocated to John Doe • 2 hours ago</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">Completed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-blue-600/30">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-3">Upgrade to Pro</h3>
              <p className="text-blue-100/90 text-sm font-medium mb-8 leading-relaxed">Unlock advanced reporting, multi-branch support, and premium layouts.</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-[1.25rem] font-black text-sm hover:scale-105 active:scale-95 transition-all w-full shadow-xl shadow-black/10">
                Go Premium
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500/30 blur-2xl rounded-full" />
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all">
            <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight">Storage Capacity</h3>
            <div className="space-y-6">
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-blue-600 rounded-full w-[72%] shadow-sm" />
              </div>
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-gray-400 uppercase tracking-widest">7.2 GB of 10 GB</span>
                <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">72%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
