"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { timeslots, appointments } from "@/db/schema";

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
  const data = await db.select().from(appointments);
  return data;
};

export const addAppointment = async (
  timeslotId: number,
  petName: string,
  species: string,
  reason: string
) => {
  await db.insert(appointments).values({
    timeslotId,
    petName,
    species,
    reason,
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
