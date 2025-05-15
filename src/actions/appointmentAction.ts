"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { timeslots, appointments, users } from "@/db/schema";

export const getTimeslots = async () => {
  const data = await db.select().from(timeslots);
  return data;
};

export const addTimeslot = async (datetime: Date) => {
  await db.insert(timeslots).values({
    datetime,
    isAvailable: true,
  });

  revalidatePath("/");
};

export const deleteTimeslot = async (id: number) => {
  await db.delete(timeslots).where(eq(timeslots.id, id));
  revalidatePath("/");
};

export const updateTimeslotAvailability = async (
  id: number,
  isAvailable: boolean
) => {
  await db.update(timeslots).set({ isAvailable }).where(eq(timeslots.id, id));

  revalidatePath("/");
};

export const getAppointments = async () => {
  const data = await db
    .select({
      id: appointments.id,
      timeslotId: appointments.timeslotId,
      petName: appointments.petName,
      species: appointments.species,
      reason: appointments.reason,
      datetime: timeslots.datetime,
    })
    .from(appointments)
    .innerJoin(timeslots, eq(appointments.timeslotId, timeslots.id));
  return data;
};

export const addAppointment = async (
  timeslotId: number,
  petName: string,
  species: string,
  reason: string,
  pickupAtHome: boolean,
  userEmail: string
) => {
  if (pickupAtHome) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (!user.length || !user[0].zipCode) {
      throw new Error("User must provide address details for home pickup.");
    }
  }

  await db.insert(appointments).values({
    timeslotId,
    petName,
    species,
    reason,
    pickupAtHome,
  });

  await updateTimeslotAvailability(timeslotId, false);

  revalidatePath("/");
};

export const deleteAppointment = async (id: number, timeslotId: number) => {
  await db.delete(appointments).where(eq(appointments.id, id));

  await updateTimeslotAvailability(timeslotId, true);

  revalidatePath("/");
};

export const updateAppointment = async (
  id: number,
  petName: string,
  species: string,
  reason: string
) => {
  await db
    .update(appointments)
    .set({
      petName,
      species,
      reason,
    })
    .where(eq(appointments.id, id));

  revalidatePath("/");
};
