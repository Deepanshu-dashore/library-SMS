"use client";

import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  CreditCard, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";

const TABS = [
  { id: "set-manage", label: "Set Manage", icon: Users },
  { id: "allocate", label: "Allocate", icon: MapPin },
  { id: "manage-expenses", label: "Manage Expenses", icon: CreditCard },
];

export default function SeatManagementPage() {
  const [activeTab, setActiveTab] = useState("set-manage");

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seat Management</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Efficiently manage and allocate seats for your library.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-sm">
            <Plus size={20} />
            Add New Seat
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl w-fit border border-gray-100 shadow-inner">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-blue-600 shadow-xl shadow-gray-100 ring-1 ring-gray-100"
                    : "text-gray-400 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by seat number, user or status..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder-gray-300"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Dynamic Content Based on Tab */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/40">
        <div className="p-20 min-h-[400px] flex flex-col items-center justify-center text-center">
            {activeTab === "set-manage" && (
                <div className="space-y-4 max-w-md">
                    <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Users className="text-blue-600 h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Seat Layout & Setup</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">Configure your library seating arrangements, define seat types, and manage availability across sections.</p>
                </div>
            )}
            
            {activeTab === "allocate" && (
                <div className="space-y-4 max-w-md">
                    <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <MapPin className="text-purple-600 h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Seat Allocation System</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">Assign seats to members, handle reservation requests, and monitor check-ins/check-outs in real-time.</p>
                </div>
            )}

            {activeTab === "manage-expenses" && (
                <div className="space-y-4 max-w-md">
                    <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CreditCard className="text-emerald-600 h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Management</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">Track maintenance costs, subscription revenues, and overhead expenses related to seat management.</p>
                </div>
            )}
        </div>
      </div>

      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-100 p-8 rounded-3xl group transition-all shadow-sm hover:shadow-2xl hover:shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Available</span>
            </div>
            <div className="text-4xl font-black text-gray-900">142</div>
            <div className="mt-3 text-xs text-gray-400 font-medium">Seats currently free for use</div>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-3xl group transition-all shadow-sm hover:shadow-2xl hover:shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-blue-500" />
                <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Occupied</span>
            </div>
            <div className="text-4xl font-black text-gray-900">58</div>
            <div className="mt-3 text-xs text-gray-400 font-medium">Ongoing active sessions</div>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-3xl group transition-all shadow-sm hover:shadow-2xl hover:shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={20} className="text-amber-500" />
                <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Maintenance</span>
            </div>
            <div className="text-4xl font-black text-gray-900">12</div>
            <div className="mt-3 text-xs text-gray-400 font-medium">Requires repair or cleaning</div>
        </div>
      </div>
    </div>
  );
}
