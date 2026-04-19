"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Info,
  Layers,
  Calendar as CalendarIcon
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-sky-600",
  "from-fuchsia-500 to-purple-600",
  "from-lime-500 to-green-600"
];

export default function SeatCalendar() {
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
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col min-h-[700px] font-sans">
      
      {/* Header Controls */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-6">
           <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100">
              <CalendarIcon className="text-indigo-600" size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none group cursor-default">
                 {currentDate.toLocaleString('default', { month: 'long' })} 
                 <span className="text-indigo-500 ml-2">{year}</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-2 flex items-center gap-2">
                <span className="w-4 h-px bg-slate-200" /> Seat Availability Timeline
              </p>
           </div>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={prevMonth} 
                className="w-11 h-11 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all active:scale-95"
            >
                <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                Month View
            </div>
            <button 
                onClick={nextMonth} 
                className="w-11 h-11 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all active:scale-95"
            >
                <ChevronRight size={20} strokeWidth={2.5} />
            </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <div className="inline-block min-w-full">
            
            {/* Days Header */}
            <div className="flex sticky top-0 z-40 bg-white border-b border-slate-200">
              <div className="w-52 shrink-0 p-4 border-r border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center gap-2">
                 <Layers size={13} className="text-slate-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Library Assets</span>
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
                        className={`w-12 h-14 flex flex-col items-center justify-center border-r border-slate-100 shrink-0 transition-colors
                          ${isToday ? 'bg-indigo-600' : isGrayColumn ? 'bg-slate-50' : 'bg-white'}
                          ${isWeekend && !isToday ? 'bg-slate-50/50' : ''}
                        `}
                      >
                         <span className={`text-[8px] font-black uppercase tracking-tighter mb-0.5 ${isToday ? 'text-white' : 'text-slate-400'}`}>
                           {date.toLocaleDateString('default', { weekday: 'short' })}
                         </span>
                         <span className={`text-[13px] font-black leading-none ${isToday ? 'text-white' : 'text-slate-800'}`}>
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
                     <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Grid...</span>
                  </div>
               ) : Object.entries(groupedSeats).map(([floor, floorSeats], fIdx) => (
                  <div key={floor}>
                    {/* Floor Label */}
                    <div className="flex bg-slate-100/50 border-b border-slate-200">
                       <div className="w-full py-2 px-5 sticky left-0 z-20">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{floor}</span>
                       </div>
                    </div>

                    {/* Seat Rows */}
                    {floorSeats.map(seat => {
                        const seatEvents = events.filter(e => e.seatNumber === seat.seatNumber);
                        return (
                            <div key={seat._id} className="flex border-b border-slate-100 h-11 group">
                              {/* Seat Name sticky cell */}
                              <div className="w-52 shrink-0 px-5 flex items-center gap-2 border-r border-slate-200 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-20">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                 <span className="text-[11px] font-black text-slate-700">Seat {seat.seatNumber}</span>
                                 <span className="text-[8px] font-bold text-slate-300 ml-auto uppercase">{seat.type}</span>
                              </div>

                              {/* Timeline cells */}
                              <div className="flex relative items-center">
                                 {daysArray.map(day => {
                                     const columnGroup = Math.floor((day - 1) / 3);
                                     const isGrayColumn = columnGroup % 2 === 1;
                                     return (
                                        <div key={day} className={`w-12 h-full border-r border-slate-50 shrink-0 ${isGrayColumn ? 'bg-slate-50/30' : ''}`} />
                                     )
                                 })}

                                 {/* Event Bars */}
                                 {seatEvents.map((event, eIdx) => {
                                     const pos = getEventPosition(event);
                                     if (!pos) return null;

                                     const leftOffset = (pos.start - 1) * 48;
                                     const width = pos.width * 48 - 4;
                                     const gradient = EVENT_GRADIENTS[eIdx % EVENT_GRADIENTS.length];
                                     
                                     const startDateObj = new Date(event.start);
                                     const endDateObj = new Date(event.end);
                                     const dateStr = `${startDateObj.getDate()}/${startDateObj.getMonth() + 1} - ${endDateObj.getDate()}/${endDateObj.getMonth() + 1}`;

                                     return (
                                        <motion.div
                                            key={eIdx}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{ 
                                                left: `${leftOffset + 2}px`, 
                                                width: `${width}px`,
                                            }}
                                            className={`absolute h-8 rounded-lg shadow-sm flex items-center px-2.5 overflow-hidden whitespace-nowrap z-10 cursor-pointer border-t border-white/20 bg-gradient-to-r ${gradient}`}
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                                                    <Users size={10} className="text-white" />
                                                </div>
                                                <div className="flex flex-col min-w-0 pr-1">
                                                    <span className="text-[9px] font-black text-white leading-none truncate">{event.user}</span>
                                                    <span className="text-[7.5px] font-bold text-white/80 leading-tight mt-0.5 truncate">
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
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400">Booked Seats</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                    <span className="text-[9px] font-black uppercase text-slate-400">Available</span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
                <Info size={12} />
                <span className="text-[9px] font-bold italic">Gantt grid showing daily duration for each member.</span>
            </div>
        </div>
      </div>
    </div>
  );
}
