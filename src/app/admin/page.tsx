import { getAppointments, getTimeslots } from "@/actions/appointmentAction";
import AdminDashboard from "@/components/admin/AdminDashboard";

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
    }, [] as Date[])
    .map((date) => date.toISOString()); // serialize dates

  return (
    <AdminDashboard
      timeslots={timeslots}
      appointments={appointments}
      datesWithAppointments={datesWithAppointments}
    />
  );
}

