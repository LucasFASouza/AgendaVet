"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";

// Helper to normalize a date to midnight UTC
function normalizeDate(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export default function AdminCalendar({
  datesWithAppointments,
  selectedDate,
  onSelectDate,
}: {
  datesWithAppointments: string[];
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
}) {
  // Convert ISO strings back to normalized Date objects (midnight UTC)
  const appointmentDates = datesWithAppointments.map((iso) => {
    const d = new Date(iso);
    return normalizeDate(d);
  });

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      disabled={(date) => {
        const norm = normalizeDate(date);
        return !appointmentDates.some(
          (appointmentDate) => appointmentDate.getTime() === norm.getTime()
        );
      }}
      modifiers={{
        hasAppointment: appointmentDates,
      }}
      modifiersStyles={{
        hasAppointment: {
          backgroundColor: "#f0f9ff",
          fontWeight: "bold",
          borderColor: "#3b82f6",
        },
      }}
      className="border rounded-md"
    />
  );
}
