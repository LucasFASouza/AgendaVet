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
import { useSession } from "next-auth/react";

const formSchema = z.object({
  date: z.date({ required_error: "Por favor selecione uma data" }),
  time: z.string({ required_error: "Por favor selecione um horário." }),
  petName: z.string().min(1, "Nome do pet é obrigatório."),
  species: z.string().min(1, "Espécie do pet é obrigatória."),
  reason: z.string().min(1, "Razão é obrigatória."),
  pickupAtHome: z.boolean(),
});

export function AppointmentForm() {
  const [timeslots, setTimeslots] = useState<
    { id: number; datetime: string; isAvailable: boolean }[]
  >([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
      petName: "",
      species: "",
      reason: "",
      pickupAtHome: false,
    },
  });

  useEffect(() => {
    const fetchTimeslots = async () => {
      const slots = await getTimeslots();
      const formattedSlots = slots.map(
        (slot: { id: number; datetime: Date; isAvailable: boolean }) => ({
          ...slot,
          datetime: slot.datetime.toISOString(), // Convert Date to string
        })
      );
      setTimeslots(formattedSlots);

      const uniqueDates = [
        ...new Set(
          formattedSlots
            .filter((slot) => slot.isAvailable)
            .map((slot) => new Date(slot.datetime).toDateString())
        ),
      ].map((dateString) => new Date(dateString));
      setAvailableDates(uniqueDates);
    };

    fetchTimeslots();
  }, []);

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
        values.reason,
        values.pickupAtHome,
        session?.user?.email || ""
      );

      const slots = await getTimeslots();
      const formattedSlots = slots.map(
        (slot: { id: number; datetime: Date; isAvailable: boolean }) => ({
          ...slot,
          datetime: slot.datetime.toISOString(), // Convert Date to string
        })
      );
      setTimeslots(formattedSlots);
      setAvailableTimes([]);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione uma data</FormLabel>
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
              <FormLabel>Selecione um horário</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={availableTimes.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
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
              <FormLabel>Nome do pet</FormLabel>
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
              <FormLabel>Espécie do pet</FormLabel>
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
              <FormLabel>Razão para consulta</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pickupAtHome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Busca em domicílio?</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={availableTimes.length === 0}>
          Agendar
        </Button>
      </form>
    </Form>
  );
}
