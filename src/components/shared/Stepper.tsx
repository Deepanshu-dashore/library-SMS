"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export interface Step {
  id: number;
  title: string;
  icon: React.ElementType;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
  progressColor?: string;
}

export function Stepper({ 
  steps, 
  currentStep, 
  className = "",
  activeColor = "bg-primary",
  inactiveColor = "bg-white border-gray-200 text-gray-400",
  progressColor = "bg-primary"
}: StepperProps) {
  return (
    <div className={`mb-10 px-4 ${className} max-w-2xl mx-auto`}>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className={`absolute top-1/2 left-0 h-0.5 ${progressColor} -translate-y-1/2 z-0 transition-all duration-500 ease-in-out`} 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isVisited = currentStep >= step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isActive 
                    ? `${activeColor} border-primary text-white shadow-lg ring-4 ring-primary/10` 
                    : isCompleted 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : inactiveColor
                }`}
              >
                {isCompleted ? (
                   <CheckCircleIcon className="w-6 h-6" />
                ) : (
                   <Icon className="w-6 h-6" />
                )}
              </div>
              <span className={`absolute -bottom-7 whitespace-nowrap text-xs font-bold capitalize transition-colors duration-300 ${
                isVisited ? "text-primary" : "text-gray-400"
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
