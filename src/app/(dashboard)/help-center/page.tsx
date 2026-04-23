"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Structure for modules with features and procedural guides
const helpModules = [
  {
    id: "dashboard",
    title: "Dashboard Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    link: "/",
    description: "The central hub for real-time library operations, occupancy, and revenue metrics.",
    features: [
      { name: "Live Insights", desc: "Displays current seat occupancy, daily revenue, active members, and quick status metrics." },
      { name: "Quick Actions", desc: "Shortcuts to register members, collect payments, and allocate seats swiftly right from the top." },
      { name: "Trends & Charts", desc: "Visual representations of joining ratios and cash flow over different time periods." }
    ],
    manual: [
      { step: 1, title: "Monitor Live Occupancy", desc: "Check the top grid to see real-time seat status. Green indicates available seats, while blue shows occupied spots." },
      { step: 2, title: "Track Revenue Trends", desc: "Scroll to the 'Balance Statistics' chart to view monthly income vs expenses. Use the range filter to see year-to-date data." },
      { step: 3, title: "Use Quick Actions", desc: "Locate the horizontal toolbar at the top for one-click access to member registration and payment modules." }
    ]
  },
  {
    id: "registration",
    title: "Registration & LMS",
    icon: "solar:user-id-bold-duotone",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    link: "/registration",
    description: "Comprehensive portal for member onboarding and status inquiry.",
    features: [
      { name: "Member Registration", desc: "A multi-step, split-screen form to capture member details, documents, photo, and initial plans." },
      { name: "Status Tracker", desc: "Allows members or staff to quickly verify onboarding status, assigned seat, and payment status." }
    ],
    manual: [
      { step: 1, title: "Enter Personal Details", desc: "Fill out the multi-step form with member name, contact info, and identity proof." },
      { step: 2, title: "Capture Profile Photo", desc: "Use the integrated camera module to take a live photo or upload a file for the ID card." },
      { step: 3, title: "Select Subscription Plan", desc: "Choose the starting plan and assign a seat before finalizing the registration." }
    ]
  },
  {
    id: "seat-management",
    title: "Seat Management",
    icon: "solar:sofa-bold-duotone",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    link: "/seats",
    description: "Manage physical seating infrastructure across multiple floors.",
    features: [
      { name: "Seat Layout Grid", desc: "A detailed visual view of all seats with their occupancy statuses (Occupied, Available, Maintenance)." },
      { name: "Bulk Addition", desc: "Quickly generate and assign multiple seats configured sequentially." },
      { name: "Seat Calendar", desc: "A timeline module visualizing bookings over weeks/months to manage future availability." }
    ],
    manual: [
      { step: 1, title: "Define Study Zones", desc: "Create floors and zones to group seats for visual navigation." },
      { step: 2, title: "Generate Seats in Bulk", desc: "Use the sequential generator to add multiple seats at once by specifying Prefix and Range." }
    ]
  },
  {
    id: "users",
    title: "Member Management",
    icon: "solar:users-group-rounded-bold-duotone",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    link: "/users",
    description: "A centralized directory for maintaining, searching, and updating all library member records.",
    features: [
      { name: "Member Directory", desc: "Data grid of all members with deep filtering by Active, Expired, or Pending states." },
      { name: "Member Profile", desc: "Detailed page displaying user information, payment history, and active seat logs." }
    ],
    manual: [
      { step: 1, title: "Filter Member Status", desc: "Use the top tabs to quickly isolate members based on their subscriptions." },
      { step: 2, title: "Detailed Profile Audit", desc: "Click on any member row to view their entire history and uploaded documents." }
    ]
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    icon: "solar:card-2-bold-duotone",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: "/subscriptions",
    description: "Handle the lifecycle of member plans, handling shift lengths, expiry notices, and seat transfers.",
    features: [
      { name: "Active Plans", desc: "Database of all ongoing subscriptions, mapping when users will require renewals." },
      { name: "Renewals & Transfers", desc: "One-click processing for renewals or shifting a user from one seat to another." }
    ],
    manual: [
      { step: 1, title: "Initiate Renewal", desc: "Locate an expired member and click 'Renew'. Confirm the duration and payment mode." },
      { step: 2, title: "Process Seat Transfer", desc: "Move a member to a different seat without resetting their existing period." }
    ]
  },
  {
    id: "payments",
    title: "Financial Payments",
    icon: "solar:wallet-money-bold-duotone",
    color: "text-green-500",
    bg: "bg-green-500/10",
    link: "/payments",
    description: "Core accounting center tracking inwards revenue from plans, penalties, and registrations.",
    features: [
      { name: "Transaction History", desc: "Chronological ledger of all payments associated with UPI, Cash, or Card modes." },
      { name: "Digital Receipts", desc: "Download professional A4-friendly invoices with verified digital signatures." }
    ],
    manual: [
      { step: 1, title: "Review Daily Ledger", desc: "Check the transaction list for daily revenue reconciliations." },
      { step: 2, title: "Generate Digital Invoices", desc: "Click 'Download Invoice' on any payment record for member records." }
    ]
  },
  {
    id: "banking",
    title: "Expenses & Banking",
    icon: "solar:banknote-2-bold-duotone",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    link: "/banking",
    description: "Maintain cash outflows, categorized operation costs, and review aggregate bank deposits.",
    features: [
      { name: "Expense Tracking", desc: "Log operation overheads (electricity, rent) to offset total profit." },
      { name: "Banking Overview", desc: "Review margins, deposits, and digital vs cash balances." }
    ],
    manual: [
      { step: 1, title: "Log System Expense", desc: "Navigate to the Expense section, select a category, and enter the amount spent." },
      { step: 2, title: "Analyze Profit Margins", desc: "Use the Banking summary to see net profit after deducting expenses from revenue." }
    ]
  },
  {
    id: "settings",
    title: "Settings & Setup",
    icon: "solar:settings-bold-duotone",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    link: "/settings",
    description: "Global module configuring application appearance, organization branding, and essential support data.",
    features: [
      { name: "Organization Branding", desc: "Configure library name, logo, and digital signatures for automated receipts." },
      { name: "Personalization", desc: "Switch themes, adjust sidebar orientation, and manage system preferences." }
    ],
    manual: [
      { step: 1, title: "Update Library Logo", desc: "Upload your official logo in the Branding tab of Settings to personalize all PDFs." },
      { step: 2, title: "Configure Support Info", desc: "Add your library hotline and email to appear on member dashboard footers." }
    ]
  },
  {
    id: "trash",
    title: "Recycle Bin",
    icon: "solar:trash-bin-trash-bold-duotone",
    color: "text-red-500",
    bg: "bg-red-500/10",
    link: "/trash",
    description: "Protection layer ensuring accidentally deleted infrastructure isn't permanently lost.",
    features: [
      { name: "Soft Deletion", desc: "Safely move members or seats to the trash instead of permanent hard deletion." },
      { name: "Instant Recovery", desc: "Restore deleted records with one click, preserving all historical data and photos." }
    ],
    manual: [
      { step: 1, title: "Recover a Member", desc: "Find the deleted member in the Recycle Bin and click the 'Restore' icon." },
      { step: 2, title: "Purge Database", desc: "Use the 'Hard Delete' option to permanently remove records and clear storage." }
    ]
  }
];

export default function HelpCenterPage() {
  const [activeModule, setActiveModule] = useState(helpModules[0].id);
  const [activeTab, setActiveTab] = useState<"features" | "guide">("features");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModules = useMemo(() => {
    if (!searchQuery) return helpModules;
    const query = searchQuery.toLowerCase();
    return helpModules.filter(mod => 
      mod.title.toLowerCase().includes(query) || 
      mod.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const activeModuleData = useMemo(() => 
    helpModules.find(m => m.id === activeModule) || helpModules[0]
  , [activeModule]);

  return (
    <div className="font-public-sans relative bg-[#fcfdfe] min-h-screen">
      <div className="">
        <PageHeader
          title="Module Documentation"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Help Center" },
          ]}
        />

        <div className="mt-6 flex flex-col xl:flex-row gap-8 text-[13px]">
          {/* Sidebar */}
          <div className="xl:w-80 shrink-0">
            <div className="sticky top-8 space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">System Manual</h3>
                 <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Select Module</p>
                 
                 <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                       <Icon icon="solar:magnifer-linear" width={16} />
                    </div>
                    <input 
                       type="text" 
                       placeholder="Find a module..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                    />
                 </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-1.5 space-y-0.5">
                {filteredModules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => {
                        setActiveModule(mod.id);
                        setActiveTab("features");
                    }}
                    className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all duration-200 text-left group cursor-pointer ${
                      activeModule === mod.id
                        ? "bg-slate-900 text-white shadow-md z-10"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeModule === mod.id ? "bg-white/10 text-white" : `${mod.bg} ${mod.color}`
                    }`}>
                      <Icon icon={mod.icon} width={18} />
                    </div>
                    <span className="font-semibold">{mod.title}</span>
                    {activeModule === mod.id && <Icon icon="solar:alt-arrow-right-linear" width={14} className="ml-auto text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[600px]">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
                {/* Header */}
                <div className="p-8 sm:p-10 bg-slate-50/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-xl ${activeModuleData.bg} ${activeModuleData.color} flex items-center justify-center shrink-0`}>
                        <Icon icon={activeModuleData.icon} width={32} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{activeModuleData.title}</h2>
                        <p className="text-slate-500 font-medium max-w-xl">{activeModuleData.description}</p>
                      </div>
                    </div>
                    <Link 
                      href={activeModuleData.link}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shrink-0 self-start md:self-center"
                    >
                      Open Module 
                      <Icon icon="solar:arrow-right-up-linear" width={16} />
                    </Link>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex items-center gap-2 mt-8 border-b border-slate-100">
                    <button 
                      onClick={() => setActiveTab("features")}
                      className={`px-5 py-3 font-bold transition-all relative ${
                        activeTab === "features" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 cursor-pointer"
                      }`}
                    >
                      Features Overview
                      {activeTab === "features" && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab("guide")}
                      className={`px-5 py-3 font-bold transition-all relative ${
                        activeTab === "guide" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 cursor-pointer"
                      }`}
                    >
                      Operational Guide
                      {activeTab === "guide" && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 sm:p-10 flex-1 overflow-visible">
                   <div className="relative h-full">
                      <AnimatePresence mode="wait">
                        {activeTab === "features" ? (
                          <motion.div 
                            key={`features-${activeModule}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                             {activeModuleData.features?.map((feature, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:bg-white hover:border-indigo-100 transition-all duration-200">
                                   <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                      {feature.name}
                                   </h4>
                                   <p className="text-slate-500 font-medium leading-relaxed">
                                      {feature.desc}
                                   </p>
                                </div>
                             )) || (
                                <div className="col-span-full py-16 text-center">
                                   <Icon icon="solar:document-add-linear" width={48} className="mx-auto text-slate-200 mb-4" />
                                   <p className="text-slate-400 italic">No feature breakdown available.</p>
                                </div>
                             )}
                          </motion.div>
                        ) : (
                          <motion.div 
                            key={`guide-${activeModule}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-10"
                          >
                             {activeModuleData.manual?.map((step) => (
                                <div key={step.step} className="group flex gap-6">
                                   <div className="flex flex-col items-center shrink-0">
                                      <div className="w-9 h-9 rounded-full border-2 border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs group-hover:border-indigo-500 group-hover:text-indigo-600 transition-all">
                                         {step.step}
                                      </div>
                                      <div className="w-px h-full bg-slate-100 mt-4 group-last:hidden" />
                                   </div>
                                   <div className="pb-4">
                                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors text-sm">
                                         {step.title}
                                      </h4>
                                      <p className="font-medium text-slate-500 leading-relaxed mb-4">
                                         {step.desc}
                                      </p>
                                   </div>
                                </div>
                             )) || (
                                <div className="py-16 text-center">
                                   <Icon icon="solar:document-add-linear" width={48} className="mx-auto text-slate-200 mb-4" />
                                   <p className="text-slate-400 italic">Procedural steps are currently under review.</p>
                                </div>
                             )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">LMS Management System v2.0</span>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Support Ticket</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
