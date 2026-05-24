"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import clsx from "clsx";

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
  const { mode } = useSelector((state: any) => state.theme);

  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      {/* Main Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2.5">
          <h1 className={clsx(
            "text-2xl font-semibold text-gray-900 tracking-tight capitalize transition-colors",
            mode === "dark" && "!text-white"
          )}>
            {title}
          </h1>
          
          <nav className="flex items-center gap-5 text-[14px] font-normal">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={idx} className="flex capitalize items-center gap-2.5">
                  {crumb.href && !isLast ? (
                    <Link 
                      href={crumb.href} 
                      className={clsx(
                        "transition-colors hover:text-primary hover:underline underline-offset-1 decoration-1 cursor-pointer",
                        mode === "dark" 
                          ? "text-slate-300 hover:underline-slate-200" 
                          : "text-gray-900 hover:underline-gray-800"
                      )}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={clsx(
                      isLast 
                        ? "text-gray-400 cursor-default" 
                        : (mode === "dark" ? "text-slate-300" : "text-gray-900")
                    )}>
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
        <div className="flex items-center gap-2">
          {actionNode && actionNode}
          {backLink && (
            <div className="flex">
              <Link 
                href={backLink}
                className={clsx(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors border cursor-pointer",
                  mode === "dark"
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-gray-700"
                    : "bg-gray-50/80 hover:bg-gray-200/80 text-gray-800 border-gray-100"
                )}
              >
                <ChevronLeftIcon className={clsx(
                  "w-3 h-3 stroke-[3.5px] transition-colors",
                  mode === "dark" ? "text-slate-300" : "text-gray-600"
                )} />
                Back
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
