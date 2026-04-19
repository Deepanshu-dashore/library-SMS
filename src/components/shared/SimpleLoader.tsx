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
    <div className=" absolute left-0 w-full h-[80dvh] flex flex-col items-center justify-center bg-white">
      <div className="w-64 space-y-4 text-center">
        {/* The horizontal track */}
        <div className="relative h-1 w-full grow overflow-hidden bg-gray-300">
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
            className="text-[12.5px] font-medium font-barlow text-gray-500/90 uppercase ml-[0.3em]"
          >
            {text}
            <span className="animate-pulse">....</span>
          </motion.p>
        )}
      </div>
    </div>
  );
};
