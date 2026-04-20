"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

export interface ActivityItem {
  id: string | number;
  leading: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  subtitle: React.ReactNode;
  trailing?: React.ReactNode;
}

interface ActivityListCardProps {
  title: string;
  tabs?: string[];
  items: ActivityItem[];
}

export function ActivityListCard({ title, tabs, items }: ActivityListCardProps) {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : "");

  return (
    <div className="bg-white rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.05),0_12px_24px_-4px_rgba(145,158,171,0.08)] p-6 flex flex-col h-full border border-gray-50/50 relative overflow-hidden transition-all duration-300">
      <h3 className="text-[18px] font-semibold text-[#212B36] mb-4 font-public-sans tracking-tight border-b border-gray-100 pb-4">{title}</h3>
      
      {tabs && tabs.length > 0 && (
        <div className="flex gap-2 mb-6 bg-[#f4f6f8] p-1.5 rounded-[12px] w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-[8px] text-[13px] font-bold transition-all duration-200 ${
                activeTab === tab 
                  ? "bg-white text-[#212B36] shadow-sm" 
                  : "text-[#637381] hover:text-[#212B36]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center justify-center">
              {item.leading}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <h4 className="text-[14px] font-bold text-[#212B36] truncate font-public-sans">
                  {item.title}
                </h4>
                {item.badge}
              </div>
              <div className="text-[13px] text-[#637381] font-medium truncate flex items-center gap-2">
                {item.subtitle}
              </div>
            </div>

            {item.trailing && (
              <div className="flex-shrink-0 flex items-center justify-end pl-2">
                {item.trailing}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
