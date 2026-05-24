import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

interface SimpleLoaderProps {
  text?: string;
  color?: string;
}

export const SimpleLoader = ({ 
  text = "Processing...", 
  color 
}: SimpleLoaderProps) => {
  const { color: themeColor, mode } = useSelector((state: any) => state.theme);

  const loaderColor = color || themeColor || (mode === "dark" ? "#818cf8" : "#1e293b");

  return (
    <div className={`absolute left-0 w-full h-[80dvh] flex flex-col items-center justify-center transition-colors ${
      mode === "dark" ? "bg-slate-950" : "bg-white"
    }`}>
      <div className="w-64 space-y-4 text-center">
        {/* The horizontal track */}
        <div className={`relative h-1 w-full grow overflow-hidden ${
          mode === "dark" ? "bg-slate-800" : "bg-gray-200"
        }`}>
          {/* Animated Bar */}
          <motion.div
            className="absolute h-full rounded-full"
            style={{ backgroundColor: loaderColor, width: "30%" }}
            initial={{ left: "-30%" }}
            animate={{ 
              left: ["-30%", "100%", "-30%"] 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {/* Optional Logo or Text vibe */}
        {text && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-[12.5px] font-semibold font-barlow uppercase ml-[0.3em] ${
              mode === "dark" ? "text-slate-400" : "text-gray-500/90"
            }`}
          >
            {text}
            <span className="animate-pulse">....</span>
          </motion.p>
        )}
      </div>
    </div>
  );
};
