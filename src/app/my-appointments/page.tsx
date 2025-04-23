"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import {
  getAppointments,
  deleteAppointment,
} from "@/actions/appointmentAction";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Appointment {
  id: number;
  timeslotId: number;
  petName: string;
  species: string;
  reason: string;
  datetime?: Date;
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  const { data: session } = useSession();

  if (!session?.user) {
    router.push("/");
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments();
      setAppointments(data as Appointment[]);
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id: number, timeslotId: number) => {
    await deleteAppointment(id, timeslotId);
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{appointment.petName}</p>
                <p>{appointment.species}</p>
                <p>{appointment.reason}</p>
                <p>
                  at{" "}
                  {appointment.datetime?.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleCancel(appointment.id, appointment.timeslotId)
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
