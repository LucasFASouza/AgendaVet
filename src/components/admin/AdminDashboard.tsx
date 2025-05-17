"use client";
import { useState, useMemo } from "react";
import AdminCalendar from "@/components/admin/AdminCalendar";
import { ManageSlotsDialog } from "@/components/admin/ManageSlotsDialog";
import { AddSlotDialog } from "@/components/admin/AddSlotDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard({
  timeslots,
  appointments,
  datesWithAppointments,
}: {
  timeslots: Array<{
    id: number;
    datetime: Date | string;
    isAvailable: boolean;
  }>;
  appointments: Array<{
    id: number;
    timeslotId: number;
    petName: string;
    species: string;
    reason: string;
    datetime: Date | string;
  }>;
  datesWithAppointments: string[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter((appointment) => {
      const d = new Date(appointment.datetime);
      return (
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [appointments, selectedDate]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Agendamentos</h2>
        <div className="flex gap-2">
          <Suspense fallback={<p>Carregando agendamentos...</p>}>
            <ManageSlotsDialog timeslots={timeslots} />
          </Suspense>
          <AddSlotDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium mb-3">Selecionar Data</h3>
          <AdminCalendar
            datesWithAppointments={datesWithAppointments}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <div className="mt-2 text-sm text-gray-500">
            <p>Apenas datas com agendamentos são selecionáveis</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Agendamentos</h3>
          <AppointmentsList appointments={filteredAppointments} />
        </div>
      </div>
    </div>
  );
}

function AppointmentsList({
  appointments,
}: {
  appointments: Array<{
    id: number;
    timeslotId: number;
    petName: string;
    species: string;
    reason: string;
    datetime: Date | string;
    userEmail?: string;
    userName?: string;
    pickupAtHome?: boolean;
  }>;
}) {
  // Helper to extract email prefix
  const getEmailPrefix = (email?: string) => {
    if (!email) return "";
    return email.split("@")[0];
  };

  return appointments.length === 0 ? (
    <div className="flex justify-center items-center h-40 border rounded-lg">
      <p className="text-gray-500">Sem agendamentos para essa data.</p>
    </div>
  ) : (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const emailPrefix = getEmailPrefix(appointment.userEmail);

        console.log(appointment);
        return (
          <Card key={appointment.id}>
            <CardHeader>
              <CardTitle>{appointment.userName} & {appointment.petName}</CardTitle>
              <div className="text-sm text-gray-500">
                {format(new Date(appointment.datetime!), "h:mm a")} -{" "}
                {appointment.species}
                {appointment.pickupAtHome && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    Busca em domicílio
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{appointment.reason}</p>
              <div className="mt-4">
                <Link
                  href={`/admin/users/${encodeURIComponent(emailPrefix)}`}
                >
                  <Button variant="outline">
                    Ver perfil do usuário
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
