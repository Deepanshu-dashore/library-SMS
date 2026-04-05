"use client";

import React from "react";
import { BookOpen, Search, Filter, Plus } from "lucide-react";

export default function LmsSoftwarePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">LMS Software</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Manage library resources, digital assets, and learning paths.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-xs uppercase tracking-widest">
            <Plus size={20} />
            Add Resource
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources, books, or students..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 outline-none focus:border-blue-500/50 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 placeholder-gray-300"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50">
        <div className="p-20 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <BookOpen className="text-blue-600 h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Learning Management System</h2>
            <p className="text-gray-400 max-w-sm mt-3 font-medium leading-relaxed">Access your digital library, course materials, and track student progress with a modern, clean interface.</p>
        </div>
      </div>
    </div>
  );
}
