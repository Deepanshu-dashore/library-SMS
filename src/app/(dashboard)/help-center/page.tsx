"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Icon } from "@iconify/react";

// Structure for modules
const helpModules = [
  {
    id: "dashboard",
    title: "Dashboard Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "The central hub for real-time library operations, occupancy, and revenue metrics.",
    tabs: [
      { name: "Live Insights", desc: "Displays current seat occupancy, daily revenue, active members, and quick status metrics." },
      { name: "Quick Actions", desc: "Shortcuts to register members, collect payments, and allocate seats swiftly right from the top." },
      { name: "Trends & Charts", desc: "Visual representations of joining ratios and cash flow over different time periods." }
    ]
  },
  {
    id: "registration",
    title: "Registration & LMS",
    icon: "solar:user-id-bold-duotone",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    description: "Comprehensive portal for member onboarding and status inquiry.",
    tabs: [
      { name: "Member Registration", desc: "A multi-step, split-screen form to capture member details, required documents, photo, and initial subscription plan." },
      { name: "Status Tracker", desc: "Allows new members or staff to quickly verify the onboarding status, assigned seat, and payment verification via phone or ID." },
    ]
  },
  {
    id: "seat-management",
    title: "Seat Management",
    icon: "solar:sofa-bold-duotone",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    description: "Manage physical seating infrastructure across multiple floors.",
    tabs: [
      { name: "Seat Layout Grid", desc: "A detailed visual view of all seats with their occupancy statuses (Occupied, Available, Maintenance)." },
      { name: "Bulk Addition", desc: "Quickly generate and assign multiple seats configured sequentially to a selected floor or study zone." },
      { name: "Maintenance Mode", desc: "Temporarily block seats that are damaged or unavailable for subscription." },
      { name: "Seat Calendar", desc: "A timeline module visualizing bookings over weeks/months to manage future conflicts and availability." }
    ]
  },
  {
    id: "users",
    title: "Member Management",
    icon: "solar:users-group-rounded-bold-duotone",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    description: "A centralized directory for maintaining, searching, and updating all library member records.",
    tabs: [
      { name: "Member Directory", desc: "Data grid of all members with deep filtering by Active, Expired, or Pending states." },
      { name: "Member Profile", desc: "Detailed page displaying user information, their payment histories, active seat, and past logs." },
      { name: "Edit Profile", desc: "Staff portal to update identity documents, change user photos, or update emergency contact." }
    ]
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    icon: "solar:card-2-bold-duotone",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    description: "Handle the lifecycle of member plans, handling shift lengths, expiry notices, and seat transfers.",
    tabs: [
      { name: "Active Plans", desc: "Database of all ongoing subscriptions, mapping when users will require renewals." },
      { name: "Renewals", desc: "One-click processing for monthly/yearly renewals keeping the selected seat uninterrupted." },
      { name: "Seat Transfers", desc: "Module to shift a user from one seat or floor to another, seamlessly transferring the plan balance." }
    ]
  },
  {
    id: "payments",
    title: "Financial Payments",
    icon: "solar:wallet-money-bold-duotone",
    color: "text-green-500",
    bg: "bg-green-500/10",
    description: "Core accounting center tracking inwards revenue from plans, penalties, and registrations.",
    tabs: [
      { name: "Transaction History", desc: "Comprehensive chronological ledger of all generated payments and their associated modes (Cash, UPI, Card)." },
      { name: "Digital Receipts", desc: "Download high-fidelity, A4-friendly invoices combining the library logo with verified digital signatures." },
      { name: "Revenue Filtering", desc: "Search financial records by custom date ranges or lookup by receipt IDs to quickly resolve disputes." }
    ]
  },
  {
    id: "banking",
    title: "Expenses & Banking",
    icon: "solar:banknote-2-bold-duotone",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    description: "Maintain cash outflows, categorized operation costs, and review aggregate bank deposits.",
    tabs: [
      { name: "Expense Tracker", desc: "Log physical or digital library overheads (electricity, rent, cleaning) to offset total profit." },
      { name: "Banking Summaries", desc: "Top-level overview showing net margins, actual deposits, and cash in hand vs digital balance." }
    ]
  },
  {
    id: "settings",
    title: "Settings & Setup",
    icon: "solar:settings-bold-duotone",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "Global module configuring application appearance, organization branding, and essential support data.",
    tabs: [
      { name: "Organization Profile", desc: "Adjust official library name, import logos and signatures, configure physical address details." },
      { name: "Help Desk Config", desc: "Register hotline numbers, support emails, operational hours, and holiday listings for members." },
      { name: "Personalization", desc: "Tweak structural layouts, sidebar orientation, and adapt standard styling logic to enterprise brand guidelines." }
    ]
  },
  {
    id: "trash",
    title: "Recycle Bin",
    icon: "solar:trash-bin-trash-bold-duotone",
    color: "text-red-500",
    bg: "bg-red-500/10",
    description: "Protection layer ensuring accidentally deleted infrastructure isn't permanently lost.",
    tabs: [
      { name: "Recovery Portal", desc: "View inactive or soft-deleted members, seats, and system records to restore them instantly without data loss." },
      { name: "Permanent Clean", desc: "Option to hard delete records beyond necessity, permanently clearing up database capacity." }
    ]
  }
];

export default function HelpCenterPage() {
  const [activeModule, setActiveModule] = useState(helpModules[0].id);

  return (
    <div className="bg-gray-50/50 min-h-screen font-public-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Module Documentation Home"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Help Center" },
          ]}
        />

        <div className="mt-8 flex flex-col xl:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="xl:w-1/3 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">How can we help?</h3>
                 <p className="text-sm font-medium text-slate-500 mb-2 leading-relaxed">Browse the modules below to understand the capabilities, tabs, and workflows of your Library Management System.</p>
               </div>
               <Icon icon="solar:round-alt-arrow-right-bold-duotone" className="absolute -bottom-10 -right-10 text-slate-100 opacity-50 block xl:hidden 2xl:block" width={160} />
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col p-3 space-y-1">
              {helpModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center gap-5 w-full p-4 rounded-[24px] transition-all duration-300 text-left group ${
                    activeModule === mod.id
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02] z-10"
                      : "text-slate-600 hover:bg-slate-50 hover:scale-[1.01]"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 transition-colors ${
                    activeModule === mod.id ? "bg-white/10 text-white" : `${mod.bg} ${mod.color}`
                  }`}>
                    <Icon icon={mod.icon} width={26} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-[15px] mb-0.5 ${activeModule === mod.id ? "text-white" : "text-slate-900 group-hover:text-indigo-600 transition-colors"}`}>{mod.title}</h4>
                    <p className={`text-[13px] ${activeModule === mod.id ? "text-slate-300" : "text-slate-400"} line-clamp-1 pr-2`}>{mod.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:w-2/3 relative">
            {helpModules.map((mod) => (
              <div
                key={mod.id}
                className={`transition-all duration-500 ease-out origin-top transform ${
                  activeModule === mod.id 
                  ? "opacity-100 scale-100 relative mb-8 z-10" 
                  : "opacity-0 scale-95 h-0 overflow-hidden absolute top-0 left-0"
                }`}
              >
                <div className="bg-white rounded-[40px] shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_24px_48px_-8px_rgba(145,158,171,0.12)] border border-gray-100 p-8 sm:p-10 md:p-14">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                    <div className={`w-[88px] h-[88px] rounded-[32px] ${mod.bg} ${mod.color} flex items-center justify-center shrink-0 shadow-inner`}>
                      <Icon icon={mod.icon} width={48} />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">{mod.title}</h2>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-2xl text-[15px]">{mod.description}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                       <span className="w-8 h-[2px] bg-slate-200 rounded-full"></span>
                       Tabs & Features Breakdown
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mod.tabs.map((tab, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-[28px] p-7 hover:bg-white hover:shadow-[0_12px_24px_-4px_rgba(145,158,171,0.12)] hover:border-indigo-100 transition-all duration-300 group">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 rounded-[16px] bg-white text-slate-400 font-black text-[15px] flex items-center justify-center shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                0{idx + 1}
                              </div>
                              <h4 className="font-bold text-slate-900 text-[17px] group-hover:text-indigo-600 transition-colors tracking-tight">{tab.name}</h4>
                           </div>
                           <p className="text-[14px] text-slate-500 leading-relaxed font-medium pl-14">
                             {tab.desc}
                           </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contextual Support Banner */}
                  <div className="mt-14 bg-slate-900 text-white rounded-[32px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between group">
                     <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
                        <h4 className="font-black text-2xl mb-2 tracking-tight">Requires technical assistance?</h4>
                        <p className="text-slate-400 text-[15px] font-medium leading-relaxed pr-4">If you face persistent issues navigating the {mod.title} module, navigate to Settings &gt; Edit Profile to reach our primary Helpdesk.</p>
                     </div>
                     <div className="relative z-10 w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shrink-0 cursor-pointer backdrop-blur-md">
                        <Icon icon="solar:chat-round-check-bold-duotone" width={32} className="text-indigo-400" />
                     </div>
                     <Icon icon={mod.icon} width={240} className="absolute -right-12 -bottom-10 opacity-[0.03] text-white transform -rotate-12 pointer-events-none" />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
