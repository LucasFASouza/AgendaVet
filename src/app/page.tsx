"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getTimeslots, addAppointment } from "@/actions/appointmentAction";
import { saveUserAddress } from "@/actions/authActions";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Timeslot {
  id: number;
  datetime: Date;
  isAvailable: boolean;
}

const formSchema = z.object({
  date: z.date({ required_error: "Por favor selecione uma data" }),
  time: z.string({ required_error: "Por favor selecione um horário." }),
  petName: z.string().min(1, "Nome do pet é obrigatório."),
  species: z.string().min(1, "Espécie do pet é obrigatória."),
  reason: z.string().min(1, "Razão é obrigatória."),
  pickupAtHome: z.boolean(),
  zipCode: z.string().optional(),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
});

export default function Page() {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Assume this is fetched from session

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
      petName: "",
      species: "",
      reason: "",
      pickupAtHome: false,
      zipCode: "",
      addressStreet: "",
      addressNumber: "",
      addressComplement: "",
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

    try {
      if (selectedSlot) {
        await addAppointment(
          selectedSlot.id,
          values.petName,
          values.species,
          values.reason,
          values.pickupAtHome,
          userEmail
        );

        // Refresh timeslots
        const slots = await getTimeslots();
        setTimeslots(slots);
        setAvailableTimes([]);
        form.reset();
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("address details")) {
        setShowAddressDialog(true);
      }
    }
  };

  const saveAddress = async (addressValues: z.infer<typeof formSchema>) => {
    await saveUserAddress(
      userEmail,
      addressValues.zipCode!,
      addressValues.addressStreet!,
      addressValues.addressNumber!,
      addressValues.addressComplement
    );
    setShowAddressDialog(false);
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Realizar agendamento</h1>
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
      </div>

      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forneça as informações de endereço</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveAddress)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressComplement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Salvar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
