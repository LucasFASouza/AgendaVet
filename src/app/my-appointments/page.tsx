"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>
                  {appointment.datetime?.toLocaleString("en-US", {
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
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleCancel(appointment.id, appointment.timeslotId)
                  }
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
