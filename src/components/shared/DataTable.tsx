"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  EllipsisVerticalIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { StatusBadge } from "./StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import clsx from "clsx";

export type ColumnType = 'text' | 'user' | 'date' | 'status' | 'custom';
export type StatusColor = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface ColumnDef<T> {
  key: string;
  label: string;
  type?: ColumnType;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  custom?: boolean;
  
  // Custom Render
  render?: (row: T) => React.ReactNode;
  
  // For 'user' type
  getAvatar?: (row: T) => string | React.ReactNode | null;
  getTitle?: (row: T) => string;
  getSubtitle?: (row: T) => string;
  
  // For 'date' type
  getDate?: (row: T) => string | Date; // We'll extract date and time
  
  
  // For 'status' type
  getStatus?: (row: T) => string; // Now can return a status key like "pending", "active"
  getStatusColor?: (row: T) => string; // Optional direct color override
  className?: string;
}

export interface ActionDef<T> {
  label: string;
  icon?: React.ElementType;
  isDanger?: boolean;
  disabled?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface TabDef {
  label: string;
  value: string;
  count?: number;
  color?: StatusColor;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  
  // Table tools
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  
  // Tabs
  tabs?: TabDef[];
  activeTab?: string;
  onTabChange?: (tabValue: string) => void;
  showCheckBox?: boolean;
  
  // Actions
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  hiddenActions?: ('view' | 'edit' | 'delete')[];
  additionalActions?: ActionDef<T>[];
  rowKey: (row: T) => string;
  
  // Custom Filter Chips
  filterChips?: React.ReactNode;
  hideSearch?: boolean;

  // Server-side Pagination
  currentPage?: number;
  totalCount?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
}

function DropdownMenu<T>({ 
  actions, 
  row, 
  onClose,
  triggerRef
}: { 
  actions: ActionDef<T>[], 
  row: T, 
  onClose: () => void,
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const { mode } = useSelector((state: any) => state.theme);

  useEffect(() => {
    if (triggerRef.current && menuRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // display slightly below and left of the trigger
      setStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left - 150 + window.scrollX, // 150 is approx menu width
        opacity: 1
      });
    }
    
    // Auto close when clicking outside
    const handleCapture = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    // Add small delay to prevent immediate closing from the trigger click itself
    setTimeout(() => {
      document.addEventListener('click', handleCapture);
    }, 10);
    
    return () => {
      document.removeEventListener('click', handleCapture);
    };
  }, [triggerRef, onClose]);

  return (
    <div 
      ref={menuRef}
      style={style}
      className={clsx(
        "fixed z-50 w-40 bg-white rounded-xl py-2 animate-in fade-in zoom-in-95 duration-200 border border-gray-100",
        mode === "dark"
          ? "!bg-[#1c252e] !border-gray-800 shadow-[0_0_2px_0_rgba(0,0,0,0.5),0_12px_24px_-4px_rgba(0,0,0,0.30)]"
          : "shadow-[0px_4px_20px_rgba(0,0,0,0.08)]"
      )}
    >
      {actions.map((action, idx) => {
        const isDisabled = action.disabled?.(row);
        return (
          <button
            key={idx}
            disabled={isDisabled}
            onClick={(e) => {
               e.stopPropagation();
               if (isDisabled) return;
               action.onClick(row);
               onClose();
            }}
            className={clsx(
              "w-full text-left px-4 py-2.5 text-sm font-semibold tracking-wide flex items-center gap-3 transition-colors",
              isDisabled 
                ? 'opacity-40 cursor-not-allowed text-gray-400'
                : action.isDanger 
                  ? (mode === "dark" ? 'text-red-400 hover:!bg-red-950/20 cursor-pointer' : 'text-red-500 hover:bg-red-50 cursor-pointer')
                  : (mode === "dark" ? 'text-slate-300 hover:!bg-slate-800 hover:text-white cursor-pointer' : 'text-gray-700 hover:bg-gray-50 cursor-pointer')
            )}
          >
            {action.icon && <action.icon className="w-4 h-4" strokeWidth={2.5} />}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export function DataTable<T>({
  data = [],
  columns = [],
  loading = false,
  searchPlaceholder = "Search...",
  onSearch,
  tabs,
  activeTab,
  onTabChange,
  onView,
  onEdit,
  onDelete,
  hiddenActions = [],
  additionalActions = [],
  rowKey,
  showCheckBox = false,
  filterChips,
  hideSearch = false,
  currentPage,
  totalCount,
  rowsPerPage: rowsPerPageProp,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps<T>) {
  
  const { mode } = useSelector((state: any) => state.theme);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDense, setIsDense] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc'|'desc' } | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  
  // Track action buttons to attach dropdowns correctly
  const actionRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // Build final actions list
  const finalActions: ActionDef<T>[] = [];
  if (!hiddenActions.includes('view')) {
    finalActions.push({ label: 'View', icon: EyeIcon, onClick: (row) => onView?.(row) });
  }
  if (!hiddenActions.includes('edit')) {
    finalActions.push({ label: 'Edit', icon: PencilIcon, onClick: (row) => onEdit?.(row) });
  }
  if (!hiddenActions.includes('delete')) {
    finalActions.push({ label: 'Delete', icon: TrashIcon, isDanger: true, onClick: (row) => onDelete?.(row) });
  }
  if (additionalActions && additionalActions.length > 0) {
    finalActions.push(...additionalActions);
  }

  // Internal filter/sort
  let processedData = Array.isArray(data) ? [...data] : [];
  
  // Pseudo-search mapping
  if (query && !onSearch) {
     const q = query.toLowerCase();
     processedData = processedData.filter(item => {
        return Object.values(item as any).some(val => 
          String(val).toLowerCase().includes(q)
        );
     });
  }

  // Sorting
  if (sortConfig) {
      processedData.sort((a: any, b: any) => {
         const aVal = a[sortConfig.key];
         const bVal = b[sortConfig.key];
         if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
         if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
         return 0;
      });
  }
  
  // Determine if we're using server-side or client-side pagination
  const isServerSide = totalCount !== undefined;
  
  const activePage = isServerSide ? (currentPage || 1) : page;
  const activeRowsPerPage = isServerSide ? (rowsPerPageProp || 10) : rowsPerPage;
  const activeTotalCount = isServerSide ? totalCount : processedData.length;
  
  const totalPages = Math.ceil(activeTotalCount / activeRowsPerPage) || 1;
  const currentData = isServerSide ? processedData : processedData.slice((activePage - 1) * activeRowsPerPage, activePage * activeRowsPerPage);


  const handleSort = (key: string) => {
     setSortConfig(prev => {
        if (prev?.key === key) {
           return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
        }
        return { key, direction: 'asc' };
     });
  };

  return (
    <div className={clsx(
      "w-full bg-white rounded-2xl shadow-xs border border-gray-100 font-sans text-sm flex flex-col transition-all duration-300",
      mode === "dark" && "!bg-[#1c252e] !border-gray-800"
    )}>
      
      {/* 1. Tabs Overlay */}
      {tabs && tabs.length > 0 && (
        <div className={clsx(
          "flex gap-10 px-6 pt-1 border-b border-gray-100 overflow-x-auto hide-scrollbar",
          mode === "dark" && "!border-gray-800"
        )}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            // Map status color to pill styles with active/hover variants
            const pillStyles = mode === "dark"
              ? {
                  success: isActive ? "bg-emerald-600 text-white" : "bg-emerald-950/40 cursor-pointer text-emerald-400 group-hover:bg-emerald-950/60",
                  warning: isActive ? "bg-amber-600 text-white"   : "bg-amber-950/40 cursor-pointer text-amber-400 group-hover:bg-amber-950/60",
                  error:   isActive ? "bg-red-600 text-white"     : "bg-red-950/40 cursor-pointer text-red-400 group-hover:bg-red-950/60",
                  info:    isActive ? "bg-indigo-600 text-white"  : "bg-indigo-950/40 cursor-pointer text-indigo-400 group-hover:bg-indigo-950/60",
                  default: isActive ? "bg-white text-gray-900"    : "bg-slate-800 cursor-pointer text-slate-400 group-hover:bg-slate-700",
                }[tab.color || 'default']
              : {
                  success: isActive ? "bg-emerald-600 text-white" : "bg-emerald-100/80 cursor-pointer text-emerald-700 group-hover:bg-emerald-100",
                  warning: isActive ? "bg-amber-600 text-white"   : "bg-amber-100/80 cursor-pointer text-amber-700 group-hover:bg-amber-100",
                  error:   isActive ? "bg-red-600 text-white"     : "bg-red-100/80 cursor-pointer text-red-700 group-hover:bg-red-100",
                  info:    isActive ? "bg-indigo-600 text-white"  : "bg-indigo-100/80 cursor-pointer text-indigo-700 group-hover:bg-indigo-100",
                  default: isActive ? "bg-gray-900 text-white"    : "bg-gray-200/80 cursor-pointer text-gray-700 group-hover:bg-gray-200",
                }[tab.color || 'default'];

            return (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={`group relative flex items-center gap-2.5 py-2.5 transition-all whitespace-nowrap outline-none`}
              >
                <span className={clsx(
                  "text-xs my-auto font-semibold tracking-tight transition-colors",
                  isActive
                    ? (mode === "dark" ? "text-white cursor-pointer" : "text-gray-900 cursor-pointer")
                    : (mode === "dark" ? "text-slate-400 group-hover:text-slate-200 cursor-pointer" : "text-gray-400 group-hover:text-gray-600 cursor-pointer")
                )}>
                  {tab.label}
                </span>

                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 flex items-center justify-center min-w-6.5 h-6.5 rounded-md text-xs font-black tracking-tighter transition-all duration-300 ${pillStyles}`}>
                    {tab.count}
                  </span>
                )}

                {/* Animated Active Underline */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className={clsx(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full z-10",
                      mode === "dark" && "!bg-white"
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Top Toolbar (Search, Filter, actions) */}
      {!hideSearch && (
        <div className={clsx(
          "p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100",
          mode === "dark" && "!border-gray-800"
        )}>
          <form 
            className="relative w-full max-w-md flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(searchInput);
              onSearch?.(searchInput);
            }}
          >
             <div className="relative w-full">
               <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 value={searchInput}
                 onChange={(e) => setSearchInput(e.target.value)}
                 placeholder={searchPlaceholder}
                 className={clsx(
                   "w-full pl-10 pr-4 py-2.5 bg-gray-50/50 outline-none border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[13px] text-gray-800 font-medium font-sans",
                   mode === "dark" && "!bg-slate-800/40 !border-gray-700 !text-white placeholder-slate-500"
                 )}
               />
             </div>
             
             <button 
               type="submit"
               className={clsx(
                 "px-5 py-2.5 cursor-pointer bg-gray-900 text-white text-[13px] font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap",
                 mode === "dark" && "!bg-slate-800 hover:!bg-slate-700 !text-white"
               )}
             >
               Search
             </button>
          </form>
          {/* Placeholder for Add/Export buttons if needed from parent */}
        </div>
      )}

      {filterChips && (
        <div className="px-4 pb-2">
          {filterChips}
        </div>
      )}

      {/* 3. Main Data Table */}
      <div className="w-full overflow-x-auto relative min-h-[300px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className={clsx(
              "bg-gray-50 border-y border-dashed border-gray-200",
              mode === "dark" && "!bg-slate-800/40 !border-gray-800"
            )}>
               {/* Checkbox column */}
               {showCheckBox && (
                 <th className="px-6 py-4 w-12">
                    <div className={clsx(
                      "w-4 h-4 rounded-[4px] border-2 cursor-pointer",
                      mode === "dark" ? "border-slate-600 hover:border-slate-500" : "border-gray-300 hover:border-gray-400"
                    )}></div>
                 </th>
               )}
               
               {columns.map((col, idx) => (
                 <th 
                   key={idx} 
                   className={clsx(
                     "px-4 py-4 text-[14px] font-semibold text-gray-500 tracking-wide select-none",
                     col.sortable && "cursor-pointer",
                     col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                     mode === "dark"
                       ? ["!text-slate-400", col.sortable && "hover:!text-slate-200"]
                       : [col.sortable && "hover:text-gray-700"]
                   )}
                   onClick={() => col.sortable && handleSort(col.key)}
                 >
                    <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                       {col.label}
                       {col.sortable && sortConfig?.key === col.key && (
                          sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-3.5 h-3.5" /> : <ArrowDownIcon className="w-3.5 h-3.5" />
                       )}
                    </div>
                 </th>
               ))}

               {finalActions && finalActions.length > 0 && (
                 <th className="px-4 py-4 w-16"></th>
               )}
            </tr>
          </thead>
          <tbody className={clsx(
            "divide-y border-dashed divide-dashed divide-gray-200 bg-white",
            mode === "dark" && "!divide-gray-800/80 !bg-[#1c252e]"
          )}>
             {loading ? (
               // ----- SKELETON LOADER -----
               Array.from({ length: rowsPerPage }).map((_, rIdx) => (
                 <tr key={`skel-${rIdx}`} className={clsx(isDense ? 'h-14' : 'h-20', mode === "dark" && "!border-gray-800/80")}>
                    {showCheckBox && (
                       <td className="px-6 py-4"><div className={clsx("w-4 h-4 rounded animate-pulse", mode === "dark" ? "bg-slate-800" : "bg-gray-100")} /></td>
                    )}
                    {columns.map((col, cIdx) => (
                      <td key={`skel-${rIdx}-${cIdx}`} className="px-4 py-4">
                         {col.type === 'user' ? (
                            <div className="flex gap-4 items-center">
                              <div className={clsx("w-10 h-10 rounded-full animate-pulse shrink-0", mode === "dark" ? "bg-slate-800" : "bg-gray-100")}></div>
                              <div className="space-y-2 w-full">
                                <div className={clsx("h-4 rounded animate-pulse w-3/4", mode === "dark" ? "bg-slate-800" : "bg-gray-100")}></div>
                                <div className={clsx("h-3 rounded animate-pulse w-1/2", mode === "dark" ? "bg-slate-800" : "bg-gray-100")}></div>
                              </div>
                            </div>
                         ) : (
                            <div className={clsx("h-4 rounded animate-pulse w-full max-w-[150px]", mode === "dark" ? "bg-slate-800" : "bg-gray-100")}></div>
                         )}
                      </td>
                    ))}
                    {finalActions && finalActions.length > 0 && (
                       <td className="px-4 py-4"><div className={clsx("h-8 w-8 rounded-full animate-pulse ml-auto", mode === "dark" ? "bg-slate-800" : "bg-gray-100")} /></td>
                    )}
                 </tr>
               ))
             ) : currentData.length === 0 ? (
               // ----- EMPTY STATE -----
               <tr>
                 <td colSpan={columns.length + (finalActions.length > 0 ? 1 : 0) + (showCheckBox ? 1 : 0)} className={clsx("px-6 py-16 text-center text-gray-500 font-bold", mode === "dark" && "!text-slate-400")}>
                    No data found
                 </td>
               </tr>
             ) : (
               // ----- ACTUAL DATA -----
               currentData.map((row) => {
                 const id = rowKey(row);
                 return (
                   <tr key={id} className={clsx(
                      "transition-colors",
                      isDense ? 'h-14' : 'h-[72px]',
                      mode === "dark" ? "hover:!bg-slate-800/20 !border-gray-800/80" : "hover:bg-gray-50/50"
                    )}>
                      {/* Checkbox */}
                      {showCheckBox && (
                        <td className="px-6">
                           <div className={clsx(
                              "w-4 h-4 rounded-[4px] border-2 cursor-pointer",
                              mode === "dark" ? "border-slate-600 hover:border-slate-500" : "border-gray-300"
                            )}></div>
                        </td>
                      )}
                      
                      {columns.map((col, cIdx) => (
                        <td 
                          key={`${id}-${cIdx}`} 
                          className={`px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                        >
                           {col.custom ? col.render?.(row) : 
                            col.type === 'user' ? (
                               <div className="flex items-center gap-4">
                                  {/* Avatar Gen */}
                                  {col.getAvatar && (() => {
                                     const ava = col.getAvatar(row);
                                     if(typeof ava === 'string' && ava.startsWith('http')) {
                                        return <img src={ava} className="w-10 h-10 rounded-full object-cover shrink-0 z-0 bg-gray-100 shadow-sm" alt="" />
                                     } else if (typeof ava === 'string') {
                                        return <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 uppercase">{ava}</div>
                                     } else {
                                        return ava; // node
                                     }
                                  })()}
                                  <div className="flex flex-col text-left">
                                     <span className={clsx("font-semibold text-gray-900 capitalize", mode === "dark" && "!text-white")}>{col.getTitle?.(row)}</span>
                                     <span className={clsx("text-[13px] text-gray-500 font-medium tracking-tight", mode === "dark" && "!text-slate-400")}>{col.getSubtitle?.(row)}</span>
                                  </div>
                               </div>
                            ) :
                            col.type === 'date' ? (() => {
                               const dateVal = col.getDate?.(row);
                               if (!dateVal) return "-";
                               const d = new Date(dateVal);
                               return (
                                 <div className="flex flex-col">
                                   <span className={clsx("font-medium text-gray-800", mode === "dark" && "!text-slate-200")}>
                                      {d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                   </span>
                                   <span className={clsx("text-[12px] text-gray-500 font-medium tracking-wider uppercase", mode === "dark" && "!text-slate-400")}>
                                      {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                   </span>
                                 </div>
                               );
                            })() :
                            col.type === 'status' ? (() => {
                               const statusKey = col.getStatus ? col.getStatus(row) : String((row as any)[col.key]);
                               return (
                                 <StatusBadge
                                   status={statusKey} 
                                   className={col.getStatusColor?.(row)} 
                                 />
                               )
                            })() :
                            col.type === 'text' ? (
                               <span className={clsx(`text-[14px] text-gray-700 font-medium ${col.className || ''}`, mode === "dark" && "!text-slate-300")}>
                                 {String((row as any)[col.key] || '-')}
                               </span>
                            ) : (
                               <span className={clsx(`text-[14px] text-gray-700 font-medium ${col.className || ''}`, mode === "dark" && "!text-slate-300")}>
                                 {col.render ? col.render(row) : String((row as any)[col.key] || '-')}
                               </span>
                            )}
                        </td>
                      ))}

                      {/* Actions */}
                      {finalActions && finalActions.length > 0 && (
                        <td className="px-6 text-right relative">
                           <button 
                             ref={el => { actionRefs.current[id] = el; }}
                             onClick={() => setOpenActionId(openActionId === id ? null : id)}
                             className={clsx(
                                "p-2 rounded-full transition-colors",
                                mode === "dark" ? "text-slate-400 hover:!text-white hover:!bg-slate-800" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                              )}
                           >
                              <EllipsisVerticalIcon className="w-5 h-5" />
                           </button>

                           {openActionId === id && (
                             <DropdownMenu 
                               actions={finalActions}
                               row={row}
                               onClose={() => setOpenActionId(null)}
                               triggerRef={{ current: actionRefs.current[id] }}
                             />
                           )}
                        </td>
                      )}
                   </tr>
                 );
               })
             )}
          </tbody>
        </table>
      </div>

      {/* 4. Bottom Toolbar (Pagination, Settings) */}
      <div className={clsx(
        "border-t border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl",
        mode === "dark" && "!bg-[#1c252e] !border-gray-800"
      )}>
         
         {/* Dense Toggle */}
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDense(!isDense)}
              className={clsx(
                "w-9 h-5 rounded-full relative transition-colors",
                isDense ? "bg-primary" : (mode === "dark" ? "bg-slate-700" : "bg-gray-200")
              )}
            >
               <div className={`absolute top-0.5 bottom-0.5 w-4 bg-white rounded-full transition-transform shadow-sm ${isDense ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </button>
            <span className={clsx("text-sm font-bold text-gray-700", mode === "dark" && "!text-slate-300")}>Dense</span>
         </div>

         {/* Pagination Controls */}
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="text-[13px] font-medium text-gray-500">Rows per page:</span>
               <select 
                 value={activeRowsPerPage} 
                 onChange={(e) => {
                    const newLimit = Number(e.target.value);
                    if (isServerSide) {
                      onRowsPerPageChange?.(newLimit);
                    } else {
                      setRowsPerPage(newLimit);
                      setPage(1);
                    }
                 }}
                 className={clsx(
                   "bg-transparent text-[13px] font-bold text-gray-900 outline-none cursor-pointer",
                   mode === "dark" && "!text-white bg-[#1c252e]"
                 )}
               >
                  <option value={5} className={clsx(mode === "dark" && "bg-slate-850 text-white")}>5</option>
                  <option value={10} className={clsx(mode === "dark" && "bg-slate-850 text-white")}>10</option>
                  <option value={20} className={clsx(mode === "dark" && "bg-slate-850 text-white")}>20</option>
                  <option value={50} className={clsx(mode === "dark" && "bg-slate-850 text-white")}>50</option>
               </select>
            </div>

            <div className={clsx("text-[13px] font-medium text-gray-700", mode === "dark" && "!text-slate-300")}>
               {activeTotalCount === 0 ? '0-0' : `${(activePage-1)*activeRowsPerPage + 1}-${Math.min(activePage*activeRowsPerPage, activeTotalCount)}`} of {activeTotalCount}
            </div>

            <div className="flex items-center gap-1">
               <button 
                 onClick={() => {
                    if (isServerSide) {
                      onPageChange?.(activePage - 1);
                    } else {
                      setPage(p => Math.max(1, p - 1));
                    }
                 }}
                 disabled={activePage <= 1}
                 className={clsx(
                   "p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
                   mode === "dark" ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                 )}
               >
                 <ChevronLeftIcon className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => {
                    if (isServerSide) {
                      onPageChange?.(activePage + 1);
                    } else {
                      setPage(p => Math.min(totalPages, p + 1));
                    }
                 }}
                 disabled={activePage >= totalPages}
                 className={clsx(
                   "p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
                   mode === "dark" ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                 )}
               >
                 <ChevronRightIcon className="w-5 h-5" />
               </button>
            </div>
         </div>

      </div>

    </div>
  );
}
