import React from "react";
import { motion } from "framer-motion";

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
  return (
    <div 
      className={`relative w-full overflow-hidden bg-gray-100 rounded-full ${className}`}
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
