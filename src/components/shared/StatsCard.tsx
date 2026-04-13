"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  Tooltip 
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: {
    value: string;
    isUp: boolean;
  };
  chartData: { value: number }[];
  chartColor: string;
}

export const StatsCard = ({ title, value, trend, chartData, chartColor }: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between group hover:border-indigo-100 transition-all duration-500">
      <div className="flex flex-col gap-2">
        <p className="text-gray-700 font-medium text-sm text-nowrap">{title}</p>
        <h3 className="text-4xl font-sans font-bold text-[#1a1a1a] tracking-tight">
          {value}
        </h3>
      </div>

      <div className="w-24 h-16 mr-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              strokeWidth={3} 
              dot={false}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
