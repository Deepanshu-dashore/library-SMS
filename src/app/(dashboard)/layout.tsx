"use client";
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeNavStyle } = useSelector((state: any) => state.theme);

  const isTopNav = activeNavStyle === "nav-top";

  return (
    <AuthGuard>
      <div 
        className={`flex bg-[#fcfcfd] h-screen overflow-hidden font-sans ${isTopNav ? "flex-col" : "flex-row"}`}
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Sidebar is fixed on the left - Hide if Top Nav */}
        {!isTopNav && <Sidebar />}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05))] via-transparent to-transparent">
            <div className="px-10 py-10 max-w-[1200px] mx-auto">
                {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

