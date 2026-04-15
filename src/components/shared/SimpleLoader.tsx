import React from "react";
import { motion } from "framer-motion";

interface SimpleLoaderProps {
  text?: string;
  color?: string;
}

export const SimpleLoader = ({ 
  text = "Processing...", 
  color = "#1e293b" 
}: SimpleLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="w-64 space-y-4 text-center">
        {/* The horizontal track */}
        <div className="relative h-[3px] w-full grow overflow-hidden bg-gray-100 rounded-full">
          {/* Animated Bar */}
          <motion.div
            className="absolute h-full rounded-full"
            style={{ backgroundColor: color, width: "30%" }}
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
            className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-[0.3em]"
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};
