"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { helpModules } from "@/constants/helpCenter";
import Link from "next/link";

export default function HelpCenterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const moduleData = useMemo(() => 
    helpModules.find(m => m.id === id)
  , [id]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!moduleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Icon icon="solar:document-cross-bold-duotone" width={64} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Module Not Found</h2>
        <button onClick={() => router.push("/help-center")} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">
          Back to Help Center
        </button>
      </div>
    );
  }

  return (
    <div className="font-public-sans">
      <div className="">
        <PageHeader 
          title="System Guide"
          backLink="/help-center"
          breadcrumbs={[
            { label: "User Guide", href: "/help-center" },
            { label: moduleData.title }
          ]}
          actionNode={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg shadow-slate-900/10 cursor-default">
               System Manual
               <Icon icon="solar:medal-star-bold" width={14} className="text-amber-400" />
            </div>
          }
        />

        {/* Main Content Layout (No Tabs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-6">
          
          {/* Left Column: Main Content (8:12) */}
          <main className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Reference Header Style */}
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 mb-10 tracking-tight leading-tight">
                  {moduleData.title}
                </h1>
                <div className="space-y-6">
                
                   <h2 className="text-base font-medium text-slate-900">Module Description</h2>
                   <p className="text-sm text-slate-700 font-medium leading-relaxed max-w-4xl">
                     {moduleData.description}
                   </p>
                </div>
              </div>

              {/* Key Capabilities Section - Bulleted Style */}
              <div className="space-y-6">
                 <h2 className="text-base font-medium text-slate-900">Key Capabilities</h2>
                 <ul className="space-y-5">
                    {moduleData.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-4 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2.5 shrink-0 group-hover:scale-150 transition-transform" />
                        <div className="space-y-1">
                           <p className="text-sm text-slate-700 font-medium leading-relaxed">
                              <span className="font-bold text-slate-800">{feature.name}:</span> {feature.desc}
                           </p>
                        </div>
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Operational Guide Section - Accordion Style */}
              <div className="space-y-10">
                 <h2 className="text-xl font-bold text-slate-900">Operational Guide</h2>
                 <div className="space-y-4">
                    {moduleData.manual.map((item: any, idx: number) => {
                      const isOpen = openIndex === idx;
                      return (
                        <div key={idx} className="border-b border-slate-100 last:border-0">
                           <button 
                             onClick={() => setOpenIndex(isOpen ? null : idx)}
                             className="w-full flex items-center justify-between py-6 cursor-pointer group text-left"
                           >
                              <div className="flex items-center gap-6">
                                 {/* Stylized Icon */}
                                 <div className="w-12 h-12 bg-white flex items-center justify-center relative shrink-0">
                                    <div className={`absolute inset-0 bg-blue-400/10 rounded-xl transition-all duration-500 ${isOpen ? 'rotate-12 scale-110' : 'rotate-6'}`} />
                                    <div className={`absolute inset-0 bg-indigo-500/10 rounded-xl transition-all duration-500 ${isOpen ? '-rotate-12 scale-110' : '-rotate-6'}`} />
                                    <Icon 
                                      icon={isOpen ? "solar:round-alt-arrow-down-bold-duotone" : "solar:round-alt-arrow-right-bold-duotone"} 
                                      width={24} 
                                      className="text-indigo-600 relative z-10 transition-all duration-300" 
                                    />
                                 </div>
                                 <div>
                                    <h3 className={`text-[17px] font-bold transition-colors duration-300 ${isOpen ? 'text-indigo-600' : 'text-slate-900'}`}>
                                       {item.name || item.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1">{item.desc}</p>
                                 </div>
                              </div>
                              <div className={`w-8 h-8 rounded-full border transition-all duration-300 flex items-center justify-center ${isOpen ? 'bg-slate-900 border-slate-900 rotate-45' : 'border-slate-200 group-hover:border-slate-400'}`}>
                                 <Icon icon="solar:add-linear" width={16} className={`transition-colors ${isOpen ? 'text-white' : 'text-slate-400'}`} />
                              </div>
                           </button>
                           
                           <AnimatePresence>
                             {isOpen && (
                               <motion.div 
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.4, ease: "easeInOut" }}
                                 className="overflow-hidden"
                               >
                                 <div className="pl-[72px] pr-8 pb-10 pt-4 space-y-10">
                                    <div className="h-px bg-slate-50 mb-8" />
                                    
                                    {/* Execution Steps */}
                                    <div className="space-y-6">
                                       <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Execution Steps</h4>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                          {(item.steps || [item.desc]).map((step: string, sIdx: number) => (
                                            <div key={sIdx} className="flex gap-4 text-[14px] font-medium text-slate-600 leading-relaxed items-start">
                                               <span className="w-5 h-5 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-slate-100 italic">
                                                  {sIdx + 1}
                                               </span>
                                               <p>{step}</p>
                                            </div>
                                          ))}
                                       </div>
                                    </div>

                                    {/* Result & Warnings in One Row */}
                                    {(item.result || (item.warnings && item.warnings.length > 0)) && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {item.result && (
                                           <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100 flex gap-4 items-start shadow-sm shadow-emerald-100/20">
                                              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                 <Icon icon="solar:check-circle-bold" width={18} />
                                              </div>
                                              <div>
                                                 <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Expected Result</h4>
                                                 <p className="text-[13px] font-bold text-slate-700 leading-snug">{item.result}</p>
                                              </div>
                                           </div>
                                         )}

                                         {item.warnings && item.warnings.length > 0 && (
                                           <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100 flex gap-4 items-start shadow-sm shadow-amber-100/20">
                                              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                                                 <Icon icon="solar:danger-bold" width={18} />
                                              </div>
                                              <div>
                                                 <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">System Warnings</h4>
                                                 <ul className="space-y-1">
                                                    {item.warnings.map((warn: string, wIdx: number) => (
                                                      <li key={wIdx} className="text-[12px] font-bold text-slate-700 flex items-center gap-2">
                                                         <span className="w-1 h-1 bg-amber-400 rounded-full" />
                                                         {warn}
                                                      </li>
                                                    ))}
                                                 </ul>
                                              </div>
                                           </div>
                                         )}
                                      </div>
                                    )}

                                    {/* Visual Preview */}
                                    {item.image && (
                                      <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-100 shadow-inner group/img relative">
                                         <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover/img:opacity-100 transition-opacity z-10" />
                                         <img 
                                           src={item.image} 
                                           alt={item.name || item.title}
                                           className="w-full object-cover grayscale opacity-90 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-1000"
                                         />
                                      </div>
                                    )}
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      );
                    })}
                 </div>
              </div>
            </motion.div>
          </main>

          {/* Right Column: Sidebar (4:12) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* White-Themed Support Card (Following 'Ready to start' layout) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group shadow-sm">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-50 transition-colors" />
               <Icon icon="solar:headphones-round-bold" width={80} className="absolute -right-5 -bottom-5 text-slate-50 group-hover:text-indigo-50 transition-colors" />
               <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10">
                     <Icon icon="solar:chat-round-dots-bold-duotone" width={24} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Need Support?</h4>
                  <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Our technical engineers are available for module assistance and custom walkthroughs.</p>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                    Contact Support Team
                  </button>
                  <p className="mt-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">+1 000-555-0198</p>
               </div>
            </div>

            {/* Quick Launch Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/10">
               <Icon icon={moduleData.icon} width={80} className="absolute -right-5 -bottom-5 text-white/5 group-hover:rotate-12 transition-transform" />
               <div className="relative z-10">
                  <h4 className="text-lg font-black mb-2">Ready to start?</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">Launch this module directly from the system dashboard.</p>
                  <Link 
                    href={moduleData.link}
                    className="flex items-center justify-center py-3 bg-white text-slate-900 rounded-xl text-xs font-black hover:bg-slate-100 transition-all"
                  >
                    Launch Module
                  </Link>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
