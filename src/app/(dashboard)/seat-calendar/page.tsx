"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import SeatCalendar from "../subscriptions/SeatCalendar";

export default function SeatCalendarPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl">
        <PageHeader 
          title="Seat Occupancy Calendar"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Calendar" }
          ]}
        />
        
        <div className="mt-6">
          <SeatCalendar />
        </div>
      </div>
    </div>
  );
}
