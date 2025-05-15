"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";

export default function AdminCalendar({
  datesWithAppointments,
  selectedDate,
  onSelectDate,
}: {
  datesWithAppointments: string[];
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
}) {
  // Convert ISO strings back to Date objects
  const appointmentDates = datesWithAppointments.map((iso) => new Date(iso));
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      disabled={(date) =>
        !appointmentDates.some(
          (appointmentDate) =>
            appointmentDate.getDate() === date.getDate() &&
            appointmentDate.getMonth() === date.getMonth() &&
            appointmentDate.getFullYear() === date.getFullYear()
        )
      }
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
