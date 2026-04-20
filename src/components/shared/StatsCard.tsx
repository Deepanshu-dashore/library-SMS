"use client";

import React from "react";
import {Icon} from "@iconify/react";

interface StatsCardProps {
  title: string;
  value: string | number;
  accentColor: string;
  icon: string;
  description?: string;
  size?: 'sm' | 'md';
}

export const StatsCard = ({ title, value, accentColor, icon, description, size = 'md' }: StatsCardProps) => {
  const isSm = size === 'sm';
  return (
    <div className={`bg-white ${isSm ? 'p-4' : 'p-6'} rounded-xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.20)] border border-gray-100 flex flex-col ${isSm ? 'gap-3' : 'gap-4'} group hover:border-indigo-100 transition-all duration-500 relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className={`text-gray-700 font-public-sans font-semibold ${isSm ? 'text-xs' : 'text-sm'} leading-[1.57143]`}>{title}</p>
          <h3 className={`${isSm ? 'text-xl' : 'text-3xl'} font-barlow font-bold text-gray-800`}>
            {value}
          </h3>
          {description && (
            <p className={`${isSm ? 'text-[10px]' : 'text-xs'} font-bold text-slate-400 mt-1 tracking-tight`}>{description}</p>
          )}
        </div>

        <div 
          className={`${isSm ? 'w-9 h-9 rounded-xl' : 'w-12 h-12 rounded-2xl'} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
          style={{ 
            backgroundColor: `${accentColor}15`,
            color: accentColor 
          }}
        >
          <Icon icon={icon} width={isSm ? 18 : 24} height={isSm ? 18 : 24} />
        </div>
      </div>
    </div>
  );
};
