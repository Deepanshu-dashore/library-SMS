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
        />

        {/* Main Content Layout (No Tabs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-6">
          
          {/* Left Column: Main Content (8:12) */}
          <main className="lg:col-span-8 bg-white border border-slate-100 rounded-xl p-8 sm:p-10">
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
               <div className="space-y-6">
                  <h2 className="text-base font-medium text-slate-900">Operational Guide</h2>
                  <div>
                    {moduleData.manual.map((item: any, idx: number) => {
                      const isOpen = openIndex === idx;
                      return (
                        <div key={idx} className="border-b border-slate-100 last:border-0">
                          {/* Accordion Header */}
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className="w-full cursor-pointer flex items-center justify-between py-4 text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                                isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {idx + 1}
                              </span>
                              <div>
                                <h3 className={`text-sm font-semibold transition-colors ${
                                  isOpen ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                                }`}>
                                  {item.name || item.title}
                                </h3>
                                {item.desc && (
                                  <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">{item.desc}</p>
                                )}
                              </div>
                            </div>
                            <Icon
                              icon="solar:alt-arrow-down-linear"
                              width={16}
                              className={`text-slate-400  ease-in-out shrink-0 transition-transform duration-300 ${
                                isOpen ? 'rotate-180 text-slate-700' : ''
                              }`}
                            />
                          </button>

                          {/* Accordion Body */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="pl-8 pt-3 pr-2 pb-5 space-y-5 bg-slate-50">

                                  {/* Steps */}
                                  <ol className="space-y-2.5">
                                    {(item.steps || [item.desc]).map((step: string, sIdx: number) => (
                                      <li key={sIdx} className="flex gap-3 items-start">
                                        <span className="w-5 h-5 rounded-sm border border-slate-300 text-[10px] font-bold text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                                          {sIdx + 1}
                                        </span>
                                        <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                                      </li>
                                    ))}
                                  </ol>

                                  {/* Result & Warnings */}
                                  {(item.result || (item.warnings && item.warnings.length > 0)) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {item.result && (
                                        <div className="flex gap-3 items-start p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
                                          <Icon icon="solar:check-circle-bold" width={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Result</p>
                                            <p className="text-xs text-slate-700 leading-snug">{item.result}</p>
                                          </div>
                                        </div>
                                      )}
                                      {item.warnings && item.warnings.length > 0 && (
                                        <div className="flex gap-3 items-start p-4 rounded-xl border border-amber-100 bg-amber-50/40">
                                          <Icon icon="solar:danger-bold" width={16} className="text-amber-500 shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Note</p>
                                            <ul className="space-y-1">
                                              {item.warnings.map((warn: string, wIdx: number) => (
                                                <li key={wIdx} className="text-xs text-slate-700 flex gap-1.5 items-start">
                                                  <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                                                  {warn}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Image */}
                                  {item.image && (
                                    <div className="rounded-xl overflow-hidden border border-slate-100">
                                      <img
                                        src={item.image}
                                        alt={item.name || item.title}
                                        className="w-full object-cover"
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
            <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden group">
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
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/10">
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
