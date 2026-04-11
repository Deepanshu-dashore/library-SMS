import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";

interface SlidingDropDownProps {
  label: string;
  name: string;
  options?: any[];
  values?: any[] | null;
  selected?: any[];
  onSelect: (selected: any[]) => void;
  error?: string[];
  multiple?: boolean;
}

export default function SlidingDropDown({
  label,
  name,
  options = [],
  values = null,
  selected = [],
  onSelect,
  error = [],
  multiple = true, // 🔸 New Prop: Single or Multiple selection (default: multiple)
}: SlidingDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { color, mode } = useSelector((state: any) => state.theme);

  const isUsingCustomValues = Array.isArray(values) && values.length === options.length;

  const getValueForOption = (index: number) => {
    return isUsingCustomValues && values ? values[index] : options[index];
  };

  const getLabelForValue = (val: any) => {
    if (isUsingCustomValues && values) {
      const idx = values.indexOf(val);
      return options[idx] || val;
    }
    return val;
  };

  const handleOptionChange = (value: any) => {
    if (multiple) {
      // Multiple selection logic
      if (selected.includes(value)) {
        onSelect(selected.filter((item) => item !== value));
      } else {
        onSelect([...selected, value]);
      }
    } else {
      // Single selection logic
      onSelect([value]);
      setIsOpen(false); // Close dropdown on single select
    }
  };

  return (
    <div className="relative w-full">
      <label
        htmlFor={name}
        className={`absolute transition-all duration-300 ${mode === "light" ? "bg-white" : "bg-[var(--card-bg)]"} px-1 capitalize 
          ${selected.length > 0 
            ? `-top-2 left-2 text-[10px] md:text-[11px] font-semibold px-2 ${mode === "light" ? "text-gray-800" : "text-gray-300"}` 
            : `top-3.5 left-4 text-[12.25px] md:text-sm ${mode === "light" ? "text-gray-400" : "text-gray-500"}`}`}
      >
        {label}
      </label>

      <div
        className={`w-full h-11 text-xs md:text-[13px] ${mode === "light" ? "text-gray-700" : "text-gray-200"} ${
          error.includes(name) 
            ? (mode === "light" ? "border-red-600 bg-red-50" : "border-red-500 bg-red-900/20")
            : (mode === "light" ? "bg-white border-gray-200 focus-within:border-amber-300" : "bg-[var(--card-bg)] border-gray-600 focus-within:border-amber-400")
        } border rounded-lg px-0.5 md:px-4 py-[14px] focus:outline-none ${mode === "light" ? "focus:border-gray-600" : "focus:border-gray-400"} cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={`${mode === "light" ? "text-gray-900" : "text-gray-200"} overflow-hidden text-ellipsis whitespace-nowrap text-xs md:text-[13px] font-normal`}>
            {selected.length > 0 ? selected.map(getLabelForValue).join(", ") : ""}
          </span>
          {isOpen ? (
            <ChevronUp className={`w-4 h-4 ${mode === "light" ? "text-gray-600" : "text-gray-400"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${mode === "light" ? "text-gray-600" : "text-gray-400"}`} />
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute backdrop-blur-lg bg-cover shadow-lg px-1 rounded-md mt-1 w-full max-h-60 overflow-auto z-30 ${mode === "light" 
            ? "bg-gradient-to-bl from-[rgba(233,248,252,1)] via-[var(--card)] to-[rgba(255,241,241,1)] bg-opacity-90 backdrop-blur-md  border-gray-300" 
              : "bg-gradient-to-bl from-[rgba(27,51,61,1)] via-[var(--card)] to-[rgba(49,40,45,1)] bg-opacity-90 backdrop-blur-md border-gray-600"
        }`}
        >
          {options.map((option, index) => {
            const value = getValueForOption(index);
            return (
              <label
                key={index}
                className={`flex items-center ${mode === "light" ? "text-gray-900" : "text-gray-200"} text-[12.25px] leading-[21px] font-medium px-4 py-2 mb-1 cursor-pointer rounded-md ${
                  selected.includes(value) 
                    ? (mode === "light" ? "bg-gray-800/8" : "bg-gray-200/8")
                    : (mode === "light" ? "hover:bg-gray-800/8" : "hover:bg-gray-200/8")
                }`}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  checked={selected.includes(value)}
                  onChange={() => handleOptionChange(value)}
                  className={`mr-2 rounded-md w-4 h-4 cursor-pointer ${mode === "light" ? "border-slate-300 outline-slate-300" : "border-gray-500 outline-gray-500"}`}
                  name={name}
                />
                {option}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
