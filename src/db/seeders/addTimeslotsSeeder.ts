import { db } from "@/db/drizzle";
import { timeslots } from "@/db/schema";

const addTimeslotsForNextMonth = async () => {
  const now = new Date();
  const end = new Date();
  end.setMonth(now.getMonth() + 1);

  const timeslotsToInsert = [];

  for (let date = new Date(now); date <= end; date.setDate(date.getDate() + 1)) {
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeslot = new Date(date);
        timeslot.setHours(hour, minute, 0, 0);
        timeslotsToInsert.push({
          datetime: timeslot,
          isAvailable: true,
        });
      }
    }
  }

  await db.insert(timeslots).values(timeslotsToInsert);
  console.log("Timeslots for the next month have been added.");
};

addTimeslotsForNextMonth()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error adding timeslots:", error);
    process.exit(1);
  });
