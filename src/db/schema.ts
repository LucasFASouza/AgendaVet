import {
  integer,
  text,
  boolean,
  pgTable,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

export const timeslots = pgTable("timeslots", {
  id: serial("id").primaryKey(),
  datetime: timestamp("datetime").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  timeslotId: integer("timeslot_id").notNull(),
  petName: text("pet_name").notNull(),
  species: text("species").notNull(),
  reason: text("reason").notNull(),
});
