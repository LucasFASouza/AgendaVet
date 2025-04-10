"use client";

import { useEffect, useState } from "react";
import {
  addTimeslot,
  getTimeslots,
  deleteTimeslot,
} from "@/actions/appointmentAction";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// Define a schema for form validation
const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
});

export default function Home() {
  const [timeslots, setTimeslots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
    },
  });

  useEffect(() => {
    const fetchTimeslots = async () => {
      setIsLoading(true);
      const slots = await getTimeslots();
      setTimeslots(slots);
      setIsLoading(false);
    };

    fetchTimeslots();
  }, []);

  const onSubmit = async (values) => {
    const { date, time } = values;

    // Combine date and time to create a Date object
    const [hours, minutes] = time.split(":");
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    await addTimeslot(dateTime);

    // Refresh timeslots
    const slots = await getTimeslots();
    setTimeslots(slots);

    // Close the dialog
    setOpen(false);

    // Reset the form
    form.reset();
  };

  const handleDelete = async (id) => {
    await deleteTimeslot(id);

    // Refresh timeslots
    const slots = await getTimeslots();
    setTimeslots(slots);
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
        <h2 className="text-xl font-semibold">Available Time Slots</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Time Slot</Button>
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
                            // Disable past dates and weekends
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

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading time slots...</p>
        </div>
      ) : timeslots.length === 0 ? (
        <div className="flex justify-center items-center h-40 border rounded-lg">
          <p className="text-gray-500">
            No time slots available. Add some to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeslots.map((slot) => (
            <Card
              key={slot.id}
              className={`${slot.isAvailable ? "bg-white" : "bg-gray-100"}`}
            >
              <CardHeader>
                <CardTitle>
                  {format(new Date(slot.datetime), "MMMM d, yyyy")}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {format(new Date(slot.datetime), "h:mm a")}
                </div>
              </CardHeader>
              <CardContent>
                <p
                  className={`font-medium ${
                    slot.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {slot.isAvailable ? "Available" : "Booked"}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(slot.id)}
                  disabled={!slot.isAvailable}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
