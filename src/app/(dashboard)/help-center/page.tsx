"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { helpModules } from "@/constants/helpCenter";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categorizedModules = useMemo(() => {
    const core = helpModules.filter(m => ["dashboard", "registration", "users", "seat-management", "subscriptions"].includes(m.id));
    const finance = helpModules.filter(m => ["payments", "banking"].includes(m.id));
    const system = helpModules.filter(m => ["settings", "trash"].includes(m.id));
    return { core, finance, system };
  }, []);

  const filteredModules = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return helpModules.filter(mod => 
      mod.title.toLowerCase().includes(query) || 
      mod.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="font-public-sans">
      <PageHeader
        title="System Guide"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "User Guide" },
        ]}
      />

      {/* Hero Section */}
      <div className="mt-6 mb-12 relative">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-[80px]" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Manual</span>
              </h1>
              
              <div className="relative group max-w-lg mx-auto">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <Icon icon="solar:magnifer-bold-duotone" width={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for tools or procedures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl text-base text-white font-medium outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 transition-all backdrop-blur-md placeholder:text-slate-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Search Results</h2>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Clear
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             <AnimatePresence mode="popLayout">
               {filteredModules?.map((mod) => (
                 <motion.div key={mod.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ModuleCard mod={mod} />
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Categories */}
          <section>
            <CategorySection title="Operations" description="Members, seats, and subscriptions" modules={categorizedModules.core} />
          </section>

          <section>
            <CategorySection title="Post-Finance" description="Revenue and expenses" modules={categorizedModules.finance} />
          </section>

          <section>
            <CategorySection title="System" description="Setup and maintenance" modules={categorizedModules.system} />
          </section>
        </div>
      )}

      {/* Simplified Support Card */}
      <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shrink-0">
               <Icon icon="solar:headphones-round-bold-duotone" width={28} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 mb-1">Need help?</h3>
               <p className="text-slate-500 text-xs font-medium max-w-sm">Support team is available for technical questions.</p>
            </div>
         </div>
         <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
               Open Ticket
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
               Live Chat
            </button>
         </div>
      </div>
    </div>
  );
}

function CategorySection({ title, description, modules }: any) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 font-medium">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod: any) => (
          <ModuleCard key={mod.id} mod={mod} />
        ))}
      </div>
    </div>
  );
}

function ModuleCard({ mod }: any) {
  return (
    <Link href={`/help-center/${mod.id}`} className="block h-full group">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
        {/* Header with Icon/Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${mod.bg} ${mod.color} flex items-center justify-center shrink-0 shadow-inner`}>
            <Icon icon={mod.icon} width={24} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {mod.title}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">System Module</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6 flex-1">
          {mod.description}
        </p>

        {/* Feature Tags (Small Gray Buttons) */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {mod.features.slice(0, 2).map((feature: any, idx: number) => (
            <div 
              key={idx} 
              className="px-3 py-1.5 bg-slate-100 group-hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black tracking-tight transition-colors"
            >
              {feature.name}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
