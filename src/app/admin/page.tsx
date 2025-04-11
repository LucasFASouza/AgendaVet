"use client";

import { useEffect, useState } from "react";
import {
  addTimeslot,
  getTimeslots,
  deleteTimeslot,
  getAppointments,
} from "@/actions/appointmentAction";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Timeslot {
  id: number;
  datetime: Date;
  isAvailable: boolean;
}

interface Appointment {
  id: number;
  timeslotId: number;
  petName: string;
  species: string;
  reason: string;
  datetime?: Date;
}

const formSchema = zod.object({
  date: zod.date({
    required_error: "Please select a date.",
  }),
  time: zod.string({
    required_error: "Please select a time.",
  }),
});

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [manageSlotOpen, setManageSlotOpen] = useState(false);
  const [datesWithAppointments, setDatesWithAppointments] = useState<Date[]>(
    []
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Timeslot[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
    },
  });

  const fetchTimeslots = async () => {
    const slots = await getTimeslots();
    const availableSlots = slots.filter((slot) => slot.isAvailable);
    setAvailableTimeSlots(availableSlots);
    return slots;
  };

  useEffect(() => {
    const fetchDatesWithAppointments = async () => {
      setIsLoading(true);
      const slots = await fetchTimeslots();

      const dates = slots
        .filter((slot) => !slot.isAvailable)
        .map((slot) => {
          const date = new Date(slot.datetime);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        })
        .reduce((unique, date) => {
          const dateString = date.toISOString().split("T")[0];
          if (
            !unique.some((d) => d.toISOString().split("T")[0] === dateString)
          ) {
            unique.push(date);
          }
          return unique;
        }, [] as Date[]);

      setDatesWithAppointments(dates);
      setIsLoading(false);
    };

    fetchDatesWithAppointments();
  }, []);

  useEffect(() => {
    const fetchAppointmentsForDate = async () => {
      if (selectedDate) {
        setIsLoading(true);
        const allAppointments = await getAppointments();
        const slots = await getTimeslots();

        const appointmentsWithTime = allAppointments.map((appointment) => {
          const timeslot = slots.find(
            (slot) => slot.id === appointment.timeslotId
          );
          return { ...appointment, datetime: timeslot?.datetime };
        });

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const filteredAppointments = appointmentsWithTime.filter(
          (appointment) => {
            if (!appointment.datetime) return false;
            const appointmentDate = new Date(appointment.datetime);
            return appointmentDate >= startOfDay && appointmentDate <= endOfDay;
          }
        );

        setAppointments(filteredAppointments);
        setIsLoading(false);
      }
    };

    fetchAppointmentsForDate();
  }, [selectedDate]);

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    const { date, time } = values;

    const [hours, minutes] = time.split(":");
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const existingTimeSlots = await getTimeslots();
    const isDuplicate = existingTimeSlots.some((slot) => {
      const slotDate = new Date(slot.datetime);
      return (
        slotDate.getFullYear() === dateTime.getFullYear() &&
        slotDate.getMonth() === dateTime.getMonth() &&
        slotDate.getDate() === dateTime.getDate() &&
        slotDate.getHours() === dateTime.getHours() &&
        slotDate.getMinutes() === dateTime.getMinutes()
      );
    });

    if (isDuplicate) {
      alert("A time slot for this date and time already exists.");
      return;
    }

    await addTimeslot(dateTime);

    fetchTimeslots();

    setAddSlotOpen(false);

    form.reset();
  };

  const handleDeleteTimeSlot = async (id: number) => {
    await deleteTimeslot(id);
    fetchTimeslots();

    alert("Time slot removed successfully.");
  };

  const availableTimeOptions = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        AgendaVet - Appointment Management
      </h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <div className="flex gap-2">
          <Dialog open={manageSlotOpen} onOpenChange={setManageSlotOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Manage Time Slots</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manage Available Time Slots</DialogTitle>
                <DialogDescription>
                  View and remove available time slots.
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[400px] overflow-y-auto">
                {availableTimeSlots.length === 0 ? (
                  <div className="flex justify-center items-center h-20 border rounded-lg">
                    <p className="text-gray-500">No available time slots.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableTimeSlots
                      .sort(
                        (a, b) =>
                          new Date(a.datetime).getTime() -
                          new Date(b.datetime).getTime()
                      )
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className="flex justify-between items-center border rounded-md p-3"
                        >
                          <div>
                            <div className="font-medium">
                              {format(new Date(slot.datetime), "MMMM d, yyyy")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(slot.datetime), "h:mm a")}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTimeSlot(slot.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={addSlotOpen} onOpenChange={setAddSlotOpen}>
            <DialogTrigger asChild>
              <Button>Add Time Slots</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new time slot</DialogTitle>
                <DialogDescription>
                  Create a new time slot for appointments.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const day = date.getDay();
                              return date < today || day === 0 || day === 6;
                            }}
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
                        <FormLabel>Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTimeOptions.map((time) => (
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

                  <DialogFooter>
                    <Button type="submit">Add Slot</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium mb-3">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              return !datesWithAppointments.some(
                (appointmentDate) =>
                  appointmentDate.getDate() === date.getDate() &&
                  appointmentDate.getMonth() === date.getMonth() &&
                  appointmentDate.getFullYear() === date.getFullYear()
              );
            }}
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
            <p>Only dates with appointments are selectable</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">
            {selectedDate
              ? `Appointments for ${format(selectedDate, "MMMM d, yyyy")}`
              : "Select a date to view appointments"}
          </h3>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex justify-center items-center h-40 border rounded-lg">
              <p className="text-gray-500">No appointments for this date.</p>
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
          )}
        </div>
      </div>
    </div>
  );
}
