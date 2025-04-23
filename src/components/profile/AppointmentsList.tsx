"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { deleteAppointment } from "@/actions/appointmentAction";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: number;
  timeslotId: number;
  petName: string;
  species: string;
  reason: string;
  datetime: Date;
}

export function AppointmentsList({
  appointments: initialAppointments,
  cancel = false,
}: {
  appointments: Appointment[];
  cancel?: boolean;
}) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const handleCancel = async (id: number, timeslotId: number) => {
    await deleteAppointment(id, timeslotId);
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <div className="container mx-auto">
      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum agendamento encontrado
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>
                  {appointment.datetime.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {appointment.petName} - {appointment.species}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{appointment.reason}</p>
              </CardContent>

              <CardFooter>
                {cancel && (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleCancel(appointment.id, appointment.timeslotId)
                    }
                  >
                    Deletar
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
