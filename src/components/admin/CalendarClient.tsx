"use client";

import { Calendar } from "@/components/ui/calendar";

export function CalendarClient({
  datesWithAppointments,
}: {
  datesWithAppointments: Date[];
}) {
  const disabledDates = (date: Date) =>
    !datesWithAppointments.some(
      (appointmentDate) =>
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
    );

  return (
    <Calendar
      mode="single"
      disabled={disabledDates}
      modifiers={{
        hasAppointment: datesWithAppointments,
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
