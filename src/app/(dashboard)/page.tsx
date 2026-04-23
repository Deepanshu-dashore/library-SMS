"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "@/components/shared/Button";
import { FEATURE_SLIDES } from "@/constants/dashboard";
import DashbordFigur from "@/components/shared/DashbordFigur";
import { StatsCard } from "@/components/shared/StatsCard";
import { ActivityListCard } from "@/components/shared/ActivityListCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (val: any) => `₹${Number(val).toLocaleString("en-IN")}`;
const formatYAxis = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return val.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden min-w-[140px]">
        <div className="bg-gray-100 px-3 py-1.5 text-center">
            <span className="text-xs font-semibold text-gray-500 capitalize">{label}</span>
        </div>
        <div className="p-3 space-y-2">
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[11px] font-semibold text-gray-600 capitalize">{entry.name}:</span>
                    </div>
                    <span className="text-xs font-medium text-gray-800 tracking-tight">{fmt(entry.value)}</span>
                </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { color,darkColor } = useSelector((state: any) => state.theme);
  const { currentUser } = useSelector((state: any) => state.user);
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good Evening");
  const [activeSlide, setActiveSlide] = useState(0);
  const [statView, setStatView] = useState("monthly");
  const [dashData, setDashData] = useState<any>(null);
  const [dashLoading, setDashLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % FEATURE_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (json?.data) setDashData(json.data);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setDashLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const sc = dashData?.StateCards;
  const alerts = dashData?.Alerts;
  const balanceSheet = dashData?.BalanceSheet;
  const liveActivity = dashData?.liveActivity;
  const quickAnalytics = dashData?.QuickAnalytics;
  const floorWishSeats = dashData?.FloorWishSeats;

  const groupedSeats = React.useMemo(() => {
    if (!floorWishSeats?.Sets) return [];
    const floors: Record<string, any[]> = {};
    floorWishSeats.Sets.forEach((s: any) => {
      if (!floors[s.floor]) floors[s.floor] = [];
      floors[s.floor].push(s);
    });
    return Object.entries(floors).map(([floor, seats]) => ({
      floor,
      seats: seats.sort((a,b) => a.seatNumber.localeCompare(b.seatNumber))
    })).sort((a,b) => a.floor.localeCompare(b.floor));
  }, [floorWishSeats]);

  const formatTimeAgo = (date: any) => {
    if (!date) return "";
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % FEATURE_SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + FEATURE_SLIDES.length) % FEATURE_SLIDES.length);

  return (
    <div className="space-y-10 font-public-sans animate-in fade-in duration-1000">
      
      {/* ─── Header Section (Welcome + Slider) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* welcome banner (2/3) */}
        <div className="lg:col-span-2 relative h-72 rounded-2xl overflow-hidden shadow-2xl group border border-slate-100/10">
          <div 
            className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 75%), url('/Dashbord/dashbordWellcome.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          <div className="relative h-full flex items-center px-12 z-10 text-white">
            <div className="flex-1 space-y-4 cursor-default font-public-sans">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back ✨</h2>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">{currentUser?.name || currentUser?.username || "Administrator"} Admin</h1>
              <p className="text-white/60 font-medium text-sm leading-relaxed mb-6">
                 Monitor your library&apos;s heartbeat. You have {(alerts?.ExpiringToday ?? 0) + (alerts?.ExpiringSoon ?? 0)} pending tasks and {liveActivity?.recentRegistrations?.length || 0} new registrations today.
              </p>
              <Button size="sm" className="bg-[#00a76f] text-white rounded-lg px-5 font-semibold py-2.5 hover:bg-[#008f5d] transition-colors border-0 shadow-lg shadow-[#00a76f]/20">
                 Go now
              </Button>
            </div>
            
            <div className="hidden md:block relative w-64 translate-y-1/5 h-full pointer-events-none">
                 <DashbordFigur />
            </div>
          </div>
        </div>

        {/* feature slider (1/3) */}
        <div className="lg:col-span-1 relative h-72 rounded-2xl overflow-hidden shadow-2xl group bg-black">
           {FEATURE_SLIDES.map((slide: any, i: number) => (
             <motion.div
               key={i}
               initial={{ opacity: 0 }}
               animate={{ opacity: activeSlide === i ? 1 : 0 }}
               transition={{ duration: 0.8 }}
               className="absolute inset-0"
             >
               <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] linear"
                  style={{ backgroundImage: `url('${slide.bg}')` }}
               />
               <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
               
               <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[#00a76f] rounded-full text-[10px] font-black uppercase tracking-widest">{slide.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 leading-tight">{slide.title}</h3>
                  <p className="text-white/60 text-xs font-medium line-clamp-2">{slide.desc}</p>
               </div>
             </motion.div>
           ))}
           
           <div className="lg:col-span-1 relative h-72 rounded-2xl overflow-hidden shadow-2xl group bg-black">
           {FEATURE_SLIDES.map((slide, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0 }}
               animate={{ opacity: activeSlide === i ? 1 : 0 }}
               transition={{ duration: 0.8 }}
               className="absolute inset-0"
             >
               <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] linear"
                  style={{ backgroundImage: `url('${slide.bg}')` }}
               />
               <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
               
               <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span style={{color:color+"ff"}} className="text-xs font-bold tracking-wider uppercase mb-2">
                     {slide.sub}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight mb-2">
                     {slide.title}
                  </h3>
                  <p className="text-white/90 text-[13px] font-medium leading-relaxed truncate">
                     {slide.desc}
                  </p>
               </div>
             </motion.div>
           ))}

           <div className="absolute top-3 left-6 right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-4">
                 {FEATURE_SLIDES.map((_, i) => (
                   <div 
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className="h-2 w-2 rounded-full transition-all cursor-pointer"
                    style={{ 
                      // width: activeSlide === i ? '12px' : '6px',
                      backgroundColor: activeSlide === i ? color : darkColor+"60" 
                    }}
                   />
                 ))}
              </div>

              <div className="flex items-center gap-2">
                 <button onClick={prevSlide} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-sm border border-white/5">
                    <Icon icon="lucide:chevron-left" width={16} />
                 </button>
                 <button onClick={nextSlide} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-sm border border-white/5">
                    <Icon icon="lucide:chevron-right" width={16} />
                 </button>
              </div>
           </div>
        </div>
        </div>
      </div>

      {/* ─── SECTION 1.5: Quick Actions (Horizontal) ─── */}
      <div className="bg-white rounded-2xl p-5 text-gray-900 relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <Icon icon="solar:widget-bold-duotone" width={100}/>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Quick Actions</h2>
            <p className="text-[11px] font-semibold text-gray-500 leading-none">Administrative Shortcuts</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
            {[
              { label: "Add Member", icon: "solar:user-plus-bold-duotone", href: "/users/create", color: " text-emerald-600 border-emerald-200" },
              { label: "Assign Seat", icon: "solar:armchair-bold-duotone", href: "/seat-management/add", color: " text-blue-600 border-blue-200" },
              { label: "Add Subscription", icon: "solar:ticket-bold-duotone", href: "/subscriptions/add", color: " text-purple-600 border-purple-200" },
              { label: "Payment", icon: "solar:card-bold-duotone", href: "/payments", color: " text-amber-600 border-amber-200" },
              { label: "Add Expense", icon: "solar:bill-list-bold-duotone", href: "/expenses/add", color: " text-rose-600 border-rose-200" },
            ].map((action, i) => (
              <a key={i} href={action.href} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border ${action.color} hover:scale-105 transition-all group backdrop-blur-sm`}>
                <Icon icon={action.icon} width={18} className="group-hover:rotate-12 transition-transform"/>
                <span className="text-sm font-medium truncate">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>


      {/* ─── SECTION 1: Critical KPIs ─── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
           <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Critical KPIs</h2>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs font-medium text-gray-400">Real-time top metrics</p>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            { label: "Total Members",        value: dashLoading ? "—" : (sc?.totalMembers ?? 0),             signal: "green",  icon: "solar:users-group-rounded-bold-duotone", sub: "All registered" },
            { label: "Active Subscriptions", value: dashLoading ? "—" : (sc?.totalActiveSubscriptions ?? 0), signal: "green",  icon: "solar:ticket-bold-duotone",              sub: "Active plans" },
            { label: "Occupied Seats",       value: dashLoading ? "—" : (sc?.totalOccupiedSeats ?? 0),        signal: "yellow", icon: "solar:armchair-bold-duotone",               sub: "Currently in use" },
            { label: "Available Seats",      value: dashLoading ? "—" : (sc?.totalAvailableSeats ?? 0),       signal: "green",  icon: "solar:sofa-bold-duotone",               sub: "Ready to assign" },
            { label: "Total Revenue",        value: dashLoading ? "—" : `₹${(sc?.totalRevenue ?? 0).toLocaleString("en-IN")}`,  signal: "green",  icon: "solar:wallet-money-bold-duotone",       sub: "All payments" },
            { label: "Monthly Revenue",      value: dashLoading ? "—" : `₹${(sc?.totalMonthlyRevenue ?? 0).toLocaleString("en-IN")}`, signal: "green",  icon: "solar:graph-up-bold-duotone",          sub: "This month" },
            { label: "Pending Renewals",     value: dashLoading ? "—" : (sc?.pendingRenewals ?? 0),           signal: "yellow", icon: "solar:clock-circle-bold-duotone",       sub: "Action needed" },
            { label: "Expiring Soon",        value: dashLoading ? "—" : (sc?.ExpiringSoon ?? 0),              signal: "red",    icon: "solar:danger-bold-duotone",              sub: "Within 7 days" },
          ] as { label: string; value: string | number; signal: "green" | "yellow" | "red"; icon: string; sub: string }[]).map((kpi, i) => {
            const colors = { green: "#10b981", yellow: "#f59e0b", red: "#f43f5e" };
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <StatsCard title={kpi.label} value={kpi.value} accentColor={colors[kpi.signal]} icon={kpi.icon} description={kpi.sub} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 2: Alerts + Seat Snapshot ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_0_2px_0_rgba(145,158,171,0.05),0_12px_24px_-4px_rgba(145,158,171,0.08)] overflow-hidden">
          <div className="p-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Alerts &amp; Urgencies</h2>
              </div>
              <p className="text-xs font-medium text-gray-400">Requires immediate attention</p>
            </div>
            <StatusBadge status={`${(alerts?.ExpiringToday ?? 0) + (alerts?.ExpiringSoon ?? 0)} Critical`} size="xs" className="!bg-rose-100 !text-rose-600 !px-3 !py-1" />
          </div>
          <div className="p-4 space-y-2">
            {([
              { label: "Expiring Today",    count: dashLoading ? "…" : (alerts?.ExpiringToday ?? 0),    unit: "users", color: "rose"  as const, icon: "solar:danger-circle-bold-duotone",    link: "/subscriptions" },
              { label: "Expiring Soon (7d)",count: dashLoading ? "…" : (alerts?.ExpiringSoon ?? 0),     unit: "users", color: "amber" as const, icon: "solar:clock-circle-bold-duotone",     link: "/subscriptions" },
              { label: "Pending Renewals",  count: dashLoading ? "…" : (alerts?.PendingRenewals ?? 0),  unit: "users", color: "amber" as const, icon: "solar:refresh-circle-bold-duotone",   link: "/subscriptions" },
              { label: "Unassigned Seats",  count: dashLoading ? "…" : (alerts?.UnassignedSeats ?? 0),  unit: "seats", color: "sky"   as const, icon: "solar:armchair-bold-duotone",             link: "/users" },
              { label: "Unverified Members",count: dashLoading ? "…" : (alerts?.UnverifiedUsers ?? 0),  unit: "users", color: "indigo" as const, icon: "solar:shield-user-bold-duotone",     link: "/users" },
            ]).map((alert, i) => {
              const c = { 
                rose: "bg-rose-50 text-rose-600 border-rose-100", 
                amber: "bg-amber-50 text-amber-600 border-amber-100", 
                sky: "bg-sky-50 text-sky-600 border-sky-100",
                indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
              };
              const badge = { 
                rose: "!bg-rose-100 !text-rose-700", 
                amber: "!bg-amber-100 !text-amber-700", 
                sky: "!bg-sky-100 !text-sky-600",
                indigo: "!bg-indigo-100 !text-indigo-700"
              };
              return (
                <a href={alert.link} key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${c[alert.color]}`}>
                    <Icon icon={alert.icon} width={18} />
                  </div>
                  <span className="flex-1 text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{alert.label}</span>
                  <StatusBadge status={`${alert.count} ${alert.unit}`} size="xs" className={`!px-2.5 !py-1 ${badge[alert.color]}`} />
                  <Icon icon="lucide:chevron-right" width={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Seat Snapshot */}
        <div className="bg-white rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.05),0_12px_24px_-4px_rgba(145,158,171,0.08)] border border-gray-50/50 transition-all duration-300 flex flex-col justify-between">
        <div className="p-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Occupied Seats</h2>
              </div>
              {/* <p className="text-xs font-medium text-gray-400"></p> */}
            </div>
          </div>
          <div className="space-y-2 p-6">
            {dashLoading ? (
               <div className="h-64 flex items-center justify-center text-slate-400 font-bold">Loading Map...</div>
            ) : (groupedSeats.map((row, ri) => (
              <div key={ri} className={ri !== 0 ? "pt-5 border-t border-gray-50" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-800 capitalize">{row.floor} Floor</span>
                  <button className="flex items-center gap-1.5 bg-slate-100/70 text-slate-500 hover:text-slate-700 font-semibold px-2.5 py-1 rounded-md text-[11px] transition-colors">
                    All Seats <Icon icon="lucide:chevron-down" width={14} />
                  </button>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                    {row.seats.map((s: any, si: number) => {
                      let colorClass = "bg-[#e2e8f0]"; // free
                      if (s.status === "occupied") colorClass = "bg-[#59c378] shadow-sm"; 
                      else if (s.status === "reserved") colorClass = "bg-[#ef6b6b] shadow-sm";
                      return (
                        <div 
                          key={si} 
                          title={`Seat ${s.seatNumber}`}
                          className={`w-[18px] h-[18px] md:w-7.5 md:h-7.5 flex items-center justify-center rounded-md transition-all hover:scale-110 cursor-pointer ${colorClass}`} 
                        >
                          <span className="text-[9px] font-bold text-slate-600">{s.seatNumber}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            )))}
          </div>

          {!dashLoading && (
            <div className="flex items-center p-6 gap-2 pt-5 border-t border-gray-50 mt-6 text-[13px] font-bold text-slate-700">
              <span className="w-4 h-4 rounded-md bg-[#59c378] shadow-[0_2px_4px_0_rgba(89,195,120,0.3)]"></span> 
              {sc?.totalOccupiedSeats || 0} of {floorWishSeats?.totalSets || 0} Seats Occupied
            </div>
          )}
        </div>
      </div>

      {/* ─── SECTION 3: Finance Overview ─── */}
      <div className="bg-white rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.05),0_12px_24px_-4px_rgba(145,158,171,0.08)] border border-gray-50/50 p-6 relative overflow-hidden transition-all duration-300">
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
           <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Balance Statistics</h2>
              </div>
              <p className="text-xs font-medium text-gray-400">Statistics on balance over time</p>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                onClick={() => router.push("/banking")}
                variant="ghost" 
                size="sm" 
                icon="mingcute:right-line"
                iconPosition="right"
                className="text-indigo-800 border border-indigo-100 hover:bg-indigo-50 font-bold flex items-center gap-2 rounded-md"
              >
                Detailed Report
              </Button>
           </div>
        </div>

        <div className="flex gap-10 mb-8">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color || "#10b981" }} />
                Total Income
              </div>
              <p className="text-xl font-medium text-gray-900">
                {dashLoading ? "…" : `₹${(sc?.totalMonthlyRevenue ?? 0).toLocaleString("en-IN")}`}
              </p>
           </div>
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Total Expenses
              </div>
              <p className="text-xl font-medium text-gray-900">
                {dashLoading ? "…" : `₹${(sc?.totalMonthlyExpenses ?? 0).toLocaleString("en-IN")}`}
              </p>
           </div>
        </div>

        <ResponsiveContainer width="100%" className="-ml-6" height={250}>
           <AreaChart data={balanceSheet ?? [
                  { month: 'Jan', income: 4000, expense: 2400 },
                  { month: 'Feb', income: 3000, expense: 1398 },
                  { month: 'Mar', income: 2000, expense: 3800 },
                  { month: 'Apr', income: 2780, expense: 3908 },
                  { month: 'May', income: 1890, expense: 4800 },
                  { month: 'Jun', income: 2390, expense: 3800 },
                  { month: 'Jul', income: 3490, expense: 4300 },
                  { month: 'Aug', income: 4000, expense: 2400 },
                  { month: 'Sep', income: 3000, expense: 1398 },
                ]}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color || "#10b981"} stopOpacity={0.1}/><stop offset="95%" stopColor={color || "#10b981"} stopOpacity={0}/></linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }} tickFormatter={formatYAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" name="Total income" dataKey="income" stroke={color || "#10b981"} strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" name="Total expenses" dataKey="expense" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
           </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── SECTION 4: Live Activity ─── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
           <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Live Activity</h2>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Real-time</span></div>
              </div>
              <p className="text-xs font-medium text-gray-400">Recent system events</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Registrations */}
          <ActivityListCard
            title="Recent Registrations"
            items={(liveActivity?.recentRegistrations || []).map((r: any, i: number) => {
              const bgColors = ["bg-indigo-100 text-indigo-700", "bg-rose-100 text-rose-700", "bg-emerald-100 text-emerald-700", "bg-sky-100 text-sky-700"];
              return {
                id: i,
                leading: <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${bgColors[i % bgColors.length]}`}>{r.name?.[0] || "?"}</div>,
                title: r.name || "New User registration",
                subtitle: <><Icon icon="solar:letter-bold" className="text-[#637381]"/> {r.email || "No Email"}</>,
                trailing: <span className="text-[12px] font-bold text-[#637381]">{formatTimeAgo(r.createdAt)}</span>
              };
            })}
          />

          {/* Recent Payments */}
          <ActivityListCard
            title="Recent Payments"
            items={(liveActivity?.recentPayments || []).map((p: any, i: number) => {
              const iconStyles: Record<string, { icon: string, bg: string }> = {
                "upi": { icon: "solar:smartphone-rotate-orientation-bold-duotone", bg: "bg-indigo-100 text-indigo-600" },
                "cash": { icon: "solar:wallet-bold-duotone", bg: "bg-emerald-100 text-emerald-600" },
                "card": { icon: "solar:card-bold-duotone", bg: "bg-amber-100 text-amber-600" },
              };
              const method = p.paymentMode || "cash";
              const style = iconStyles[method.toLowerCase()] || iconStyles["cash"];
              return {
                id: i,
                leading: <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg}`}><Icon icon={style.icon} width={20} /></div>,
                title: p.userId?.name || "Member Payment",
                badge: <StatusBadge status={method.toUpperCase()} size="xs" />,
                subtitle: <><Icon icon="solar:clock-circle-bold" className="text-gray-500"/> {formatTimeAgo(p.createdAt)}</>,
                trailing: <span className="text-[14px] font-barlow font-bold text-emerald-600">₹{p.amount?.toLocaleString("en-IN")}</span>
              };
            })}
          />

          {/* Seat Allocations */}
          <ActivityListCard
            title="Seat Allocations"
            items={(liveActivity?.recentSeatAllocation || []).map((a: any, i: number) => {
              const isAC = a.type === "ac";
              const style = isAC
                ? { icon: "solar:snowflake-bold-duotone", bg: "bg-sky-100 text-sky-600" }
                : { icon: "solar:armchair-bold-duotone", bg: "bg-amber-100 text-amber-600" };
              return {
                id: i,
                leading: <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg}`}><Icon icon={style.icon} width={20} /></div>,
                title: `Seat ${a.seatNumber}`,
                badge: <StatusBadge status={isAC ? "AC" : "Normal"} size="xs" />,
                subtitle: (
                  <>
                    <Icon icon="solar:map-point-bold" className="text-[#637381]"/> {a.floor}
                    <span className="text-slate-300 mx-1">•</span>
                    <Icon icon="solar:clock-circle-bold" className="text-[#637381]"/> {formatTimeAgo(a.updatedAt)}
                  </>
                ),
              };
            })}
          />
        </div>
      </div>
    </div>
  );
}

