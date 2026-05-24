import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import clsx from "clsx";

interface LineLoaderProps {
  color?: string;
  height?: number | string;
  className?: string;
}

export const LineLoader = ({ 
  color = "#3b82f6", 
  height = 3, 
  className = "" 
}: LineLoaderProps) => {
  const { mode } = useSelector((state: any) => state.theme);

  return (
    <div 
      className={clsx(
        "relative w-full overflow-hidden rounded-full",
        mode === "dark" ? "bg-slate-800/40" : "bg-gray-100",
        className
      )}
      style={{ height }}
    >
      <motion.div
        className="absolute h-full rounded-full"
        style={{ 
          backgroundColor: color,
          width: "30%",
          boxShadow: `0 0 8px ${color}40`
        }}
        initial={{ left: "-30%" }}
        animate={{ 
          left: ["-30%", "100%", "-30%"] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  );
};
