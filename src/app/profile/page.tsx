import { getAppointments } from "@/actions/appointmentAction";
import { AppointmentsList } from "@/components/profile/AppointmentsList";
import { EditUserDialog } from "@/components/profile/EditUserDialog";

export default async function MyAppointmentsPage() {
  const now = new Date();
  const appointments = (await getAppointments()).map((appointment) => ({
    ...appointment,
    datetime: new Date(appointment.datetime),
  }));

  const pastAppointments = appointments.filter(
    (appointment) => appointment.datetime < now
  );
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.datetime >= now
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Perfil</h1>
      <EditUserDialog />
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Histórico</h2>
          <AppointmentsList appointments={pastAppointments} />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Consultas agendadas</h2>
          <AppointmentsList appointments={upcomingAppointments} cancel={true} />
        </div>
      </div>
    </div>
  );
}
