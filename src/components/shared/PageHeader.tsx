"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  actionNode?: React.ReactNode;
  backLink?: string;
}

export function PageHeader({ title, breadcrumbs, actionNode, backLink }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      {/* Main Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
          
          <nav className="flex items-center gap-5 text-[14px] font-normal">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  {crumb.href && !isLast ? (
                    <Link 
                      href={crumb.href} 
                      className="text-gray-900 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-gray-400 cursor-default" : "text-gray-900"}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="text-slate-400 font-black">•</span>}
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* Action Button Node */}
        {actionNode && (
           <div className="flex items-center shrink-0">
             {actionNode}
           </div>
        )}
        {backLink && (
        <div className="flex">
          <Link 
            href={backLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/80 hover:bg-gray-100 text-gray-800 text-[13px] font-bold rounded-lg transition-colors border border-gray-100"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600 stroke-[3px]" />
            Back
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}
