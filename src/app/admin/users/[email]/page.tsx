import { getAppointmentsByEmail } from "@/actions/appointmentAction";
import { AppointmentsList } from "@/components/profile/AppointmentsList";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function AdminUserProfilePage(props: {
  params: { email: string };
}) {
  const { email } = props.params;
  if (!email) return notFound();

  // Fetch user info by email
  const userArr = await db
    .select()
    .from(users)
    .where(eq(users.email, `${email}@gmail.com`))
    .limit(1);
  const user = userArr[0];

  const now = new Date();
  const appointments = (await getAppointmentsByEmail(email)).map(
    (appointment) => ({
      ...appointment,
      datetime: new Date(appointment.datetime),
    })
  );

  const pastAppointments = appointments.filter(
    (appointment) => appointment.datetime < now
  );
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.datetime >= now
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>
      {user && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <div>
            {user.addressStreet}, {user.addressNumber}
            {user.addressComplement ? `, ${user.addressComplement}` : ""}
          </div>
          <div>
            {user.zipCode && user.zipCode.length === 8
              ? `${user.zipCode.slice(0, 5)}-${user.zipCode.slice(5)}`
              : user.zipCode}
          </div>
        </div>
      )}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Histórico</h2>
          <AppointmentsList appointments={pastAppointments} />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Consultas agendadas</h2>
          <AppointmentsList appointments={upcomingAppointments} />
        </div>
      </div>
    </div>
  );
}
