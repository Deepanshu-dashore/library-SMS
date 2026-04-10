"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to format date in dd/mm/yy format
const formatDate = (dateString: any) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
};

// Helper function to safely get nested values
const getNestedValue = (obj: any, path: any): any => {
  if (!path) return "-";
  const isValidDate = (date: any) => !isNaN(new Date(date).getTime());

  const pathSegments = path.toString()
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.');

  let value = pathSegments.reduce((acc: any, key: any) => {
    return acc && acc[key] !== undefined ? acc[key] : "-";
  }, obj);

  if (path.toString().toLowerCase().includes("date") && isValidDate(value)) {
    return formatDate(value);
  }

  const clampText = (text: any, maxLength = 150) => {
    if (typeof window !== "undefined" && window.innerWidth < 800) {
      maxLength = 60;
    }
    if (typeof text === "string" && text.length > maxLength) {
      return text.slice(0, maxLength).trim() + "…";
    }
    return text;
  };

  if (Array.isArray(value)) {
    return value.length > 0 ? clampText(value.join(", ")) : "--";
  }

  return clampText(value || "-");
};

export default function Table({
  headers = [],
  dataKeys = [],
  Data = [],
  serialNumber = true,
  fistColumnView = true,
  hiddenActions = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  isLoading = false,
  extraColumns = [],
  paginationshow = true,
  extraMethods = {},
  Search = false,
  SerachWidth = "full",
  Searchholder = "Search...",
  CheckboxShow = false,
  Searchvalue,
  SearchChange = () => {},
  SearchButtonClick = () => {},
  onClear = () => {},
  children,
  extraContent,
  nextLine = false,
  Export,
  ExportFunction = () => { },
  filters = false,
  ImageKey = false,
  ImageContainerShow = true,
  hasStatus = false,
  selectedRows = [],
  setSelectedRows = () => { },
  PDFExport,
  PDFExportFunction = () => { },
  isRadio = false,
  rowPage = 5,
  totalItems = 0,
  page = 1,
  totalPages = 0,
  onPageChange = () => { },
  onRowsPerPageChange = () => { },
  AuthRole,
  Role,
  customActions = [],
}: any) {
  const [viewModel, setViewModel] = useState<any>(false);
  const [isOpen, setActiveRow] = useState<any>(false);
  const { color, mode } = useSelector((state: any) => state.theme);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [rowsPerPage, setRowsPerPage] = useState(rowPage || 5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [visibleKeys, setVisibleKeys] = useState(dataKeys);

  const updateVisibleKeys = () => {
    const width = window.innerWidth;
    const hasStatusCol = !!hasStatus;
    const allKeys = hasStatusCol ? [...dataKeys] : dataKeys;
    const totalHeaderLength = headers.length + (hasStatusCol ? 1 : 0);

    if (width < 600) {
      const firstTwo = allKeys.slice(0, 2);
      const lastTwo = allKeys.slice(-3);
      setVisibleKeys([...firstTwo, ...lastTwo]);
    } else if (width < 800) {
      if (headers.length === 4) {
        setVisibleKeys(allKeys);
      } else {
        const temp = [...allKeys];
        temp.splice(1, 2);
        setVisibleKeys(temp);
      }
    } else if (width < 990 && totalHeaderLength === 6) {
      const temp = [...allKeys];
      temp.splice(2, 1);
      setVisibleKeys(temp);
    } else {
      setVisibleKeys(allKeys);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateVisibleKeys();
      window.addEventListener("resize", updateVisibleKeys);
      return () => window.removeEventListener("resize", updateVisibleKeys);
    }
  }, [headers, dataKeys, hasStatus]);

  const allKeys = hasStatus ? [...dataKeys] : dataKeys;
  const allHeaders = hasStatus ? [...headers] : headers;

  const visibleHeaders = visibleKeys.map((key: any) => {
    const index = allKeys.indexOf(key);
    return allHeaders[index];
  });

  const handleRowsChange = (value: any) => {
    setRowsPerPage(value);
    setCurrentPage(1);
    setDropdownOpen(false);
  };

  const currentRows = Data;
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (isRadio) return;
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(Data.map((row: any) => row._id));
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id: any) => {
    if (isRadio) {
      setSelectedRows([id]);
    } else {
      let updatedSelection = selectedRows.includes(id)
        ? selectedRows.filter((rowId: any) => rowId !== id)
        : [...selectedRows, id];
      setSelectedRows(updatedSelection);
      setSelectAll(updatedSelection.length === Data.length);
    }
  };

  useEffect(() => {
    setSelectAll(selectedRows.length === Data.length && Data.length > 0);
  }, [selectedRows, Data]);

  const statusStyles: any = {
    Pending: "text-[var(--yellow-700)] bg-[var(--yellow-100)]",
    pending: "text-[var(--yellow-700)] bg-[var(--yellow-100)]",
    Printed: "text-[var(--green-600)] bg-[var(--green-100)]",
    "In-Process": "text-[var(--indigo-700)] bg-[var(--indigo-100)]",
    Completed: "text-[var(--green-700)] bg-[var(--green-100)]",
    completed: "text-[var(--green-700)] bg-[var(--green-100)]",
    Cancelled: "text-[var(--red-700)] bg-[var(--red-100)]",
    Refunded: "text-[var(--gray-700)] bg-[var(--gray-100)]",
    New: "text-[var(--green-800)] bg-[var(--green-100)]",
    "Follow-up": "text-[var(--yellow-800)] bg-[var(--yellow-100)]",
    Converted: "text-[var(--blue-800)] bg-[var(--blue-100)]",
    "Not Interested": "text-[var(--red-800)] bg-[var(--red-100)]",
    Processing: "text-[var(--blue-700)] bg-[var(--blue-100)]",
    Paid: "text-[var(--green-700)] bg-[var(--green-100)]",
    Unpaid: "text-[var(--red-700)] bg-[var(--red-100)]",
    "Out of date": "text-[var(--yellow-700)] bg-[var(--yellow-100)]",
    Progress: "text-[var(--blue-700)] bg-[var(--blue-100)]",
    Partial: "text-[var(--orange-700)] bg-[var(--orange-100)]",
    Individual: "text-[var(--gray-700)] bg-[var(--gray-100)]",
    Business: "text-[var(--blue-700)] bg-[var(--blue-100)]",
    VIP: "text-[var(--yellow-700)] bg-[var(--yellow-100)]",
    boolean: "text-[var(--purple-700)] bg-[var(--purple-100)]",
    string: "text-[var(--blue-700)] bg-[var(--blue-100)]",
    checklist: "text-[var(--green-700)] bg-[var(--green-100)]",
    option: "text-[var(--orange-700)] bg-[var(--orange-100)]",
    Active: "text-[var(--green-700)] bg-[var(--green-100)]",
    Banned: "text-[var(--red-700)] bg-[var(--red-100)]",
    "low-stock": "text-[var(--orange-700)] bg-[var(--orange-100)]",
    "out-of-stock": "text-[var(--red-700)] bg-[var(--red-100)]",
    "in-stock": "text-[var(--green-700)] bg-[var(--green-100)]",
    lowStock: "text-[var(--orange-700)] bg-[var(--orange-100)]",
    outOfStock: "text-[var(--red-700)] bg-[var(--red-100)]",
    inStock: "text-[var(--green-700)] bg-[var(--green-100)]",
  };

  return (
    <>
      <div className={`hidden md:block ${mode === "light" ? "bg-white border-gray-200" : "bg-[#1c252e] border-gray-700"} border text-[#1C252E] shadow-md rounded-xl overflow-visble transition-shadow`}>
        {filters && filters}
        {Search && (
          <div className="w-full px-3 mt-3 pb-4 flex items-center justify-between">
            <div className="relative w-fit hidden lg:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  SearchButtonClick && Searchvalue && SearchButtonClick(Searchvalue);
                }}
                className="relative"
              >
                <div className={`relative flex items-center ${mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-600"} rounded-lg shadow-xs border transition-all duration-200`}>
                  <div className="flex items-center justify-center pl-4 pr-2">
                    <svg className={`w-5 h-5 ${mode === "light" ? "text-gray-400" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={Searchholder}
                    value={Searchvalue}
                    onChange={(e) => SearchChange(e)}
                    className={`flex-1 py-3 px-2 bg-transparent ${mode === "light" ? "text-gray-900 placeholder-gray-500" : "text-white placeholder-gray-400"} focus:outline-none text-sm`}
                    autoComplete="off"
                  />
                  <div className="flex items-center pr-2 pl-2 gap-2">
                    {Searchvalue && (
                      <button
                        type="button"
                        onClick={() => onClear && onClear()}
                        className={`flex items-center justify-center cursor-pointer w-8 h-8 rounded-lg ${mode === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"} transition-colors duration-150`}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className={`h-7 w-7 ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      style={{ backgroundColor: color }}
                      className={`flex items-center text-sm gap-2 font-semibold cursor-pointer justify-center w-fit h-8 px-4 rounded-lg text-white transition-colors duration-150 focus:outline-none`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* Mobile Expandable Search Bar equivalent goes here - trimmed for brevity */}
            <div className={(children || extraContent || Export || PDFExport) ? "h-22 py-5 px-5 flex gap-3 flex-10/12 items-center flex-wrap w-full" : ""}>
              {children}
              {/* Additional Action Buttons */}
              {extraContent}
            </div>
          </div>
        )}

        {nextLine && nextLine}
        {isLoading ? (
          <div className={`${mode === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-white"} w-full p-10 text-center shadow-sm rounded-xl`}>
            Loading...
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto xl:w-full w-[95.5dvw] sm:w-[90dvw] md:w-[89.45dvw] lg:w-full">
              <table className="w-full border-collapse">
                <thead className={`${mode === "light" ? "bg-gray-100" : "bg-gray-700"}`}>
                  <tr className={`${mode === "light" ? "text-gray-900" : "text-gray-200"} align-middle mt-2 sm:mt-0`}>
                    {serialNumber && <th className={`pl-3 pr-2 py-3.5 text-sm text-left font-semibold border-r-[0.8px] border-b-[0.8px] border-dashed ${mode === "light" ? "border-gray-300" : "border-gray-600"}`}>S.No.</th>}
                    {visibleHeaders.map((header: any, index: any) => (
                      <th key={index} className={`p-[19px] py-3.5 px-2 capitalize text-nowrap text-sm text-left font-semibold border-r-[0.8px] border-b-[0.8px] border-dashed ${mode === "light" ? "border-gray-300" : "border-gray-600"}`}>
                        {header}
                      </th>
                    ))}
                    {!hiddenActions.includes("Action") && <th className="p-[19px] py-3.5 text-sm border-b-[0.8px] border-dashed">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {Data.length < 1 ? (
                    <tr>
                      <td colSpan={allHeaders.length + 3} className="text-center p-10 text-gray-500 font-bold">No data found...</td>
                    </tr>
                  ) : (
                    currentRows.map((row: any, rowIndex: any) => (
                      <tr key={row._id || rowIndex} className={`${mode === "light" ? "text-gray-500 bg-white hover:bg-gray-50" : "text-gray-200 bg-gray-800 hover:bg-gray-700"} align-middle`}>
                        {serialNumber && (
                           <td className={`pl-4 py-2 border-r-[0.8px] border-b-[0.8px] border-dashed ${mode === "light" ? "border-gray-300" : "border-gray-600"}`}>
                             {(rowIndex + 1).toString().padStart(2, '0')}.
                           </td>
                        )}
                        
                        {visibleKeys.map((key: any, colIndex: any) => (
                          <td key={colIndex} className={`p-4 py-2 text-nowrap border-r-[0.8px] border-b-[0.8px] border-dashed ${mode === "light" ? "border-gray-300" : "border-gray-600"}`}>
                             {getNestedValue(row, key)}
                          </td>
                        ))}
                        
                        {!hiddenActions.includes("Action") && (
                          <td className={`p-4 py-2 text-nowrap border-b-[0.8px] border-dashed ${mode === "light" ? "border-gray-300" : "border-gray-600"}`}>
                            <div className="flex items-center gap-4">
                              {!hiddenActions.includes("view") && onView && (
                                <button
                                  onClick={() => onView(row)}
                                  className="text-blue-500 hover:text-blue-700 font-bold text-[11px] uppercase tracking-tighter cursor-pointer transition-colors"
                                >
                                  View
                                </button>
                              )}
                              {!hiddenActions.includes("edit") && onEdit && (
                                <button
                                  onClick={() => onEdit(row)}
                                  className="text-amber-500 hover:text-amber-700 font-bold text-[11px] uppercase tracking-tighter cursor-pointer transition-colors"
                                >
                                  Edit
                                </button>
                              )}
                              {!hiddenActions.includes("delete") && onDelete && (
                                <button
                                  onClick={() => onDelete(row)}
                                  className="text-red-500 hover:text-red-700 font-bold text-[11px] uppercase tracking-tighter cursor-pointer transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
let colorIndex = 0; 
const getNextColor = () => {
  const color = colors[colorIndex]; 
  colorIndex = (colorIndex + 1) % colors.length;
  return color;
};

const ImageContainer = ({ imageSrc, name, setViewModel = () => { }, mode }: any) => {
  const fallbackLetter = name ? name.charAt(0).toUpperCase() : "A";
  const sequentialBgColor = getNextColor(); 

  return (
    <div onClick={() => { imageSrc && setViewModel({ imageSrc, name }) }} className={`lg:w-10 hidden sm:flex cursor-pointer w-8 h-8 lg:h-10 items-center justify-center overflow-hidden rounded-md`}>
      {imageSrc ? (
        <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-6.5 h-6.5 flex items-center justify-center text-white ${sequentialBgColor}`}>
          {fallbackLetter}
        </div>
      )}
    </div>
  );
};
