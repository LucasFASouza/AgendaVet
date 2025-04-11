"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getTimeslots, addAppointment } from "@/actions/appointmentAction";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Timeslot {
  id: number;
  datetime: Date;
  isAvailable: boolean;
}

const formSchema = z.object({
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time." }),
  petName: z.string().min(1, "Pet name is required."),
  species: z.string().min(1, "Species is required."),
  reason: z.string().min(1, "Reason is required."),
});

export default function Page() {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
      petName: "",
      species: "",
      reason: "",
    },
  });

  useEffect(() => {
    const fetchTimeslots = async () => {
      const slots = await getTimeslots();
      setTimeslots(slots);

      const uniqueDates = [
        ...new Set(
          slots
            .filter((slot) => slot.isAvailable)
            .map((slot) => new Date(slot.datetime).toDateString())
        ),
      ].map((dateString) => new Date(dateString));
      setAvailableDates(uniqueDates);
    };

    fetchTimeslots();
  }, []);

  // Change the parameter type to match what Calendar expects
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    const filteredTimes = timeslots
      .filter(
        (slot) =>
          new Date(slot.datetime).toDateString() === date.toDateString() &&
          slot.isAvailable
      )
      .map((slot) => {
        const time = new Date(slot.datetime);
        return time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      });
    setAvailableTimes(filteredTimes);
    form.setValue("time", ""); // Reset time selection
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const selectedSlot = timeslots.find(
      (slot) =>
        new Date(slot.datetime).toDateString() ===
          new Date(values.date).toDateString() &&
        new Date(slot.datetime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) === values.time
    );

    if (selectedSlot) {
      await addAppointment(
        selectedSlot.id,
        values.petName,
        values.species,
        values.reason
      );

      // Refresh timeslots
      const slots = await getTimeslots();
      setTimeslots(slots);
      setAvailableTimes([]);
      form.reset();
    }
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Date</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        handleDateChange(date);
                      }}
                      disabled={(date) =>
                        !availableDates.some(
                          (availableDate) =>
                            availableDate.toDateString() === date.toDateString()
                        )
                      }
                      className="border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={availableTimes.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Species</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Appointment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={availableTimes.length === 0}>
              Book Appointment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
