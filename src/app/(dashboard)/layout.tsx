import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#fcfcfd] h-screen overflow-hidden font-sans">
      {/* Sidebar is fixed on the left */}
      <Sidebar />
      
      {/* Main content scrolls independently */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05))] via-transparent to-transparent">
        <div className="px-10 py-10 max-w-[1200px] mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
