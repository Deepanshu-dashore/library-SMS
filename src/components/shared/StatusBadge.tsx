import { getStatusStyle } from "@/constants/status";
import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = "sm", 
  className = "" 
}) => {
  const style = getStatusStyle(status);
  
  const sizeClasses = {
    xxs: "px-1.5 py-0 text-[8px]",
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-md font-bold transition-all whitespace-nowrap
        ${style.color}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {style.label}
    </span>
  );
};
