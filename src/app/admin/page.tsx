import { format } from "date-fns";
import { getAppointments, getTimeslots } from "@/actions/appointmentAction";
import { ManageSlotsDialog } from "@/components/admin/ManageSlotsDialog";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSlotDialog } from "@/components/admin/AddSlotDialog";
import { Suspense } from "react";

export default async function AdminPage() {
  const timeslots = await getTimeslots();
  const appointments = await getAppointments();

  const datesWithAppointments = timeslots
    .filter((slot) => !slot.isAvailable)
    .map((slot) => {
      const date = new Date(slot.datetime);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    })
    .reduce((unique, date) => {
      const dateString = date.toISOString().split("T")[0];
      if (!unique.some((d) => d.toISOString().split("T")[0] === dateString)) {
        unique.push(date);
      }
      return unique;
    }, [] as Date[]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AgendaVet - Gerenciamento</h1>

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
          <Calendar
            mode="single"
            disabled={(date) =>
              !datesWithAppointments.some(
                (appointmentDate) =>
                  appointmentDate.getDate() === date.getDate() &&
                  appointmentDate.getMonth() === date.getMonth() &&
                  appointmentDate.getFullYear() === date.getFullYear()
              )
            }
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
          <div className="mt-2 text-sm text-gray-500">
            <p>Apenas datas com agendamentos são selecionáveis</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Agendamentos</h3>
          <AppointmentsList appointments={appointments} />
        </div>
      </div>
    </div>
  );
}

function AppointmentsList({ appointments }: { appointments: any[] }) {
  return appointments.length === 0 ? (
    <div className="flex justify-center items-center h-40 border rounded-lg">
      <p className="text-gray-500">Sem agendamentos para essa data.</p>
    </div>
  ) : (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader>
            <CardTitle>{appointment.petName}</CardTitle>
            <div className="text-sm text-gray-500">
              {format(new Date(appointment.datetime!), "h:mm a")} -{" "}
              {appointment.species}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{appointment.reason}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
