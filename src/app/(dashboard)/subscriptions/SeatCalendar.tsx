"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, 
  ChevronRight, 
  Users,
  Info,
  Layers,
  Calendar as CalendarIcon
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface Seat {
  _id: string;
  seatNumber: string;
  floor: string;
  type: string;
  status: string;
}

interface CalendarEvent {
  seatNumber: string;
  start: string;
  end: string;
  user: string;
  status: string;
}

const EVENT_GRADIENTS = [
  "from-[#0ea5e9] to-[#2563eb]", // Azure Blue
  "from-[#10b981] to-[#059669]", // Emerald
  "from-[#f59e0b] to-[#d97706]", // Amber
  "from-[#6366f1] to-[#4f46e5]", // Indigo
  "from-[#ec4899] to-[#db2777]", // Pink
  "from-[#8b5cf6] to-[#7c3aed]", // Violet
  "from-[#14b8a6] to-[#0d9488]", // Teal
  "from-[#f97316] to-[#ea580c]", // Orange
  "from-[#06b6d4] to-[#0891b2]", // Cyan
  "from-[#f43f5e] to-[#e11d48]", // Rose
  "from-[#84cc16] to-[#65a30d]", // Lime
  "from-[#a855f7] to-[#9333ea]"  // Purple
];

export default function SeatCalendar() {
  const { color } = useSelector((state: RootState) => state.theme);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [seats, setSeats] = useState<Seat[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seatsRes, eventsRes] = await Promise.all([
        fetch("/api/seat?limit=500"),
        fetch(`/api/subscription/calender?month=${month}&year=${year}`)
      ]);
      
      const [seatsData, eventsData] = await Promise.all([
        seatsRes.json(),
        eventsRes.json()
      ]);

      if (seatsData.success) {
        setSeats(seatsData.data.seats);
      }
      if (eventsData.success) {
        const transformedEvents = eventsData.data.map((e: any) => ({
          seatNumber: e.title.replace("Seat ", ""),
          start: e.start,
          end: e.end,
          user: e.user,
          status: e.status
        }));
        setEvents(transformedEvents);
      }
    } catch (error) {
      toast.error("Failed to load timeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  // Group seats by floor and sort them numerically/sequentially
  const groupedSeats = useMemo(() => {
    const groups: Record<string, Seat[]> = {};
    
    // 1. Group by floor
    seats.forEach(seat => {
      const floor = seat.floor || "General Area";
      if (!groups[floor]) groups[floor] = [];
      groups[floor].push(seat);
    });
    
    // 2. Sort seats within each floor first to find the "minimum" seat for that floor
    Object.keys(groups).forEach(floor => {
        groups[floor].sort((a,b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true, sensitivity: 'base' }));
    });
    
    // 3. Sort the floors based on the smallest seat number they contain
    const sortedFloors = Object.keys(groups).sort((a, b) => {
        const minA = groups[a][0].seatNumber;
        const minB = groups[b][0].seatNumber;
        return minA.localeCompare(minB, undefined, { numeric: true, sensitivity: 'base' });
    });

    // 4. Create a sorted object following the new floor order
    const sortedGroups: Record<string, Seat[]> = {};
    sortedFloors.forEach(floor => {
        sortedGroups[floor] = groups[floor];
    });

    return sortedGroups;
  }, [seats]);

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    let startDayPosition = 1;
    if (start.getMonth() === month && start.getFullYear() === year) {
        startDayPosition = start.getDate();
    } else if (start < new Date(year, month, 1)) {
        startDayPosition = 1;
    } else {
        return null;
    }

    let endDayPosition = daysInMonth;
    if (end.getMonth() === month && end.getFullYear() === year) {
        endDayPosition = end.getDate();
    } else if (end > new Date(year, month, daysInMonth)) {
        endDayPosition = daysInMonth;
    } else {
        return null; 
    }
    
    if (startDayPosition > daysInMonth || endDayPosition < 1) return null;

    return {
        start: startDayPosition,
        width: endDayPosition - startDayPosition + 1
    };
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col min-h-auto font-sans">
      
      {/* Header Controls */}
      <div className="px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-4">
           <div className="p-3 py-2 rounded-sm" style={{ backgroundColor:color+"20" ,color}} >
              <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 36 36">
                <path fill="currentColor" d="M32 13.22V30H4V8h3V6H3.75A1.78 1.78 0 0 0 2 7.81v22.38A1.78 1.78 0 0 0 3.75 32h28.5A1.78 1.78 0 0 0 34 30.19V12.34a7.5 7.5 0 0 1-2 .88" className="clr-i-outline--badged clr-i-outline-path-1--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M8 14h2v2H8z" className="clr-i-outline--badged clr-i-outline-path-2--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M14 14h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-3--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M20 14h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-4--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M26 14h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-5--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M8 19h2v2H8z" className="clr-i-outline--badged clr-i-outline-path-6--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M14 19h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-7--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M20 19h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-8--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M26 19h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-9--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M8 24h2v2H8z" className="clr-i-outline--badged clr-i-outline-path-10--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M14 24h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-11--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M20 24h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-12--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M26 24h2v2h-2z" className="clr-i-outline--badged clr-i-outline-path-13--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M10 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" className="clr-i-outline--badged clr-i-outline-path-14--badged" strokeWidth={1} stroke="currentColor"></path>
                <path fill="currentColor" d="M22.5 6H13v2h9.78a7.5 7.5 0 0 1-.28-2" className="clr-i-outline--badged clr-i-outline-path-15--badged" strokeWidth={1} stroke="currentColor"></path>
                <circle cx={30} cy={6} r={5} fill="currentColor" className="clr-i-outline--badged clr-i-outline-path-16--badged clr-i-badge" strokeWidth={1} stroke="currentColor"></circle>
                <path fill="none" d="M0 0h36v36H0z"></path>
              </svg>
           </div>
           <div className=" h-11 border-r-3" style={{ borderColor: color+"30"}}>
           </div>
           <div>
              <h2 className="text-xl font-public-sans font-bold text-gray-900 leading-none group cursor-default">
                 {currentDate.toLocaleString('default', { month: 'long' })} 
                 <span style={{ color }} className="ml-2 font-barlow">{year}</span>
              </h2>
                    <p className="text-[12px] font-public-sans text-gray-500 mt-0.5">Seat Availability Timeline</p>

              {/* <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-2 flex items-center gap-2">
                <span className="w-4 h-px bg-slate-200" /> Seat Availability Timeline
                    <p className="text-[13px] font-public-sans text-gray-500 mt-0.5 mb-2">Pick an available seat from the library layout.</p>

              </p> */}
           </div>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={prevMonth} 
                style={{ "--hover-color": color } as React.CSSProperties}
                className="px-4 py-2 text-xs font-public-sans font-semibold gap-2 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:text-[var(--hover-color)] hover:border-[var(--hover-color)]/20 hover:shadow-lg hover:shadow-[var(--hover-color)]/5 transition-all active:scale-95"
            >
                <ChevronLeft size={16} strokeWidth={2.5} />
              Prev
            </button>
            <button 
                onClick={nextMonth} 
                style={{ "--hover-color": color } as React.CSSProperties}
                className="px-4 py-2 text-xs font-public-sans font-semibold gap-2 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 cursor-pointer hover:text-[var(--hover-color)] hover:border-[var(--hover-color)]/20 hover:shadow-lg hover:shadow-[var(--hover-color)]/5 transition-all active:scale-95"
            >
            Next
                <ChevronRight size={16} strokeWidth={2.5} />
            </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <div className="inline-block min-w-full">
            
            {/* Days Header */}
            <div className="flex sticky top-0 z-40 bg-white border-b border-slate-200">
              <div className="w-42 shrink-0 p-4 border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center gap-2">
                 <Layers size={13} className="text-slate-400" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Library Assets</span>
              </div>
              <div className="flex">
                {daysArray.map(day => {
                   const date = new Date(year, month, day);
                   const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                   const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                   
                   // Alternating column logic: groups of 3
                   const columnGroup = Math.floor((day - 1) / 3);
                   const isGrayColumn = columnGroup % 2 === 1;

                   return (
                      <div 
                        key={day} 
                        className={`w-12 h-14 flex flex-col items-center justify-center border-r border-slate-200/80 shrink-0 transition-colors
                          ${isToday ? '' : isGrayColumn ? 'bg-slate-100/70' : 'bg-white'}
                          ${isWeekend && !isToday ? 'bg-slate-100/40' : ''}
                        `}
                        style={isToday ? { backgroundColor: color } : {}}
                      >
                         <span className={`text-[8px] font-public-sans font-bold uppercase tracking-tighter mb-0.5 ${isToday ? 'text-white' : 'text-slate-400'}`}>
                           {date.toLocaleDateString('default', { weekday: 'short' })}
                         </span>
                         <span className={`text-[13px] font-public-sans font-bold leading-none ${isToday ? 'text-white' : 'text-slate-800'}`}>
                           {day}
                         </span>
                      </div>
                   )
                })}
              </div>
            </div>

            {/* Grid Content */}
            <div className="relative">
                {loading ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse">
                     <div className="w-10 h-10 border-4 border-slate-100 rounded-full animate-spin" style={{ borderTopColor: color }} />
                     <span className="text-[10px] font-public-sans font-bold uppercase tracking-widest text-slate-400">Loading Grid...</span>
                  </div>
                ) : Object.entries(groupedSeats).map(([floor, floorSeats], fIdx) => (
                  <div key={floor}>
                    {/* Floor Label */}
                    <div className="flex bg-slate-100/60 border-b border-slate-200/50">
                       <div className="w-full py-1.5 px-5 sticky left-0 z-20">
                          <span className="text-[10px] font-public-sans font-bold uppercase tracking-[0.2em] text-slate-400">{floor}</span>
                       </div>
                    </div>

                    {/* Seat Rows */}
                    {floorSeats.map(seat => {
                        const seatEvents = events.filter(e => e.seatNumber === seat.seatNumber);
                        return (
                            <div key={seat._id} className="flex border-b border-slate-200/60 h-11 group">
                              {/* Seat Name sticky cell */}
                              <div className="w-42 shrink-0 px-5 flex items-center gap-2 border-r border-slate-200 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-20">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                 <span className="text-[11px] font-public-sans font-bold text-slate-600">Seat {seat.seatNumber}</span>
                                 <StatusBadge 
                                    status={seat.type} 
                                    size="xxs" 
                                    className={`ml-auto border border-transparent ${
                                       seat.type.toLowerCase() === 'ac' 
                                          ? 'bg-indigo-100/70 text-indigo-600 border-indigo-100' 
                                          : 'bg-slate-200/60 text-slate-500 border-slate-100'
                                    }`} 
                                 />
                              </div>

                              {/* Timeline cells */}
                              <div className="flex relative items-center">
                                  {daysArray.map(day => {
                                     const columnGroup = Math.floor((day - 1) / 3);
                                     const isGrayColumn = columnGroup % 2 === 1;
                                     const date = new Date(year, month, day);
                                     const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                     
                                     return (
                                        <div 
                                          key={day} 
                                          className={`w-12 h-full border-r border-slate-200/60 shrink-0 
                                            ${isGrayColumn ? 'bg-slate-100/50' : ''}
                                            ${isWeekend ? 'bg-slate-100/20' : ''}
                                          `} 
                                        />
                                     )
                                  })}

                                 {/* Event Bars */}
                                 {seatEvents.map((event, eIdx) => {
                                     const pos = getEventPosition(event);
                                     if (!pos) return null;

                                     const leftOffset = (pos.start - 1) * 48;
                                     const width = pos.width * 48 - 4;
                                     
                                     // Assign color based on user name for consistency, or use global event index
                                     const colorIdx = events.findIndex(e => e === event) % EVENT_GRADIENTS.length;
                                     const gradient = EVENT_GRADIENTS[colorIdx];
                                     
                                     const startDateObj = new Date(event.start);
                                     const endDateObj = new Date(event.end);
                                     const dateStr = `${startDateObj.getDate()} ${startDateObj.toLocaleString('default', { month: 'short' })} - ${endDateObj.getDate()} ${endDateObj.toLocaleString('default', { month: 'short' })}`;

                                     return (
                                        <motion.div
                                            key={eIdx}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{ 
                                                left: `${leftOffset + 2}px`, 
                                                width: `${width}px`,
                                            }}
                                            className={`absolute h-8 rounded-sm shadow-sm flex items-center px-2.5 overflow-hidden whitespace-nowrap z-10 cursor-pointer border-t border-white/20 bg-gradient-to-r ${gradient}`}
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                                                    <Users size={10} className="text-white" />
                                                </div>
                                                <div className="flex min-w-0 pr-1 gap-5 items-center">
                                                    <span className="text-xs capitalize font-public-sans font-bold text-white leading-none truncate">{event.user}</span>
                                                    <span className="text-xs font-public-sans font-medium text-white/80 leading-tight mt-0.5 truncate">
                                                        {dateStr}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                     )
                                 })}
                              </div>
                            </div>
                        )
                    })}
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[9px] font-public-sans font-bold uppercase text-slate-400">Booked Seats</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                    <span className="text-[9px] font-public-sans font-bold uppercase text-slate-400">Available</span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
                <Info size={12} />
                <span className="text-[9px] font-public-sans font-bold italic">Gantt grid showing daily duration for each member.</span>
            </div>
        </div>
      </div>
    </div>
  );
}
