"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveUserAddress } from "@/actions/authActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  zipCode: z.string().min(1, "CEP é obrigatório."),
  addressStreet: z.string().min(1, "Logradouro é obrigatória."),
  addressNumber: z.string().min(1, "Número é obrigatório."),
  addressComplement: z.string().optional(),
});

export function AddressDialog({
  open,
  setOpen,
  onSaved,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipCode: "",
      addressStreet: "",
      addressNumber: "",
      addressComplement: "",
    },
  });

  // Handler to fetch address from ViaCEP
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;
      form.setValue("addressStreet", data.logradouro || "");
      form.setValue("addressComplement", data.complemento || "");
    } catch (err) {
      // Optionally handle error
    }
  };

  const saveAddress = async (values: z.infer<typeof formSchema>) => {
    await saveUserAddress(
      values.zipCode,
      values.addressStreet,
      values.addressNumber,
      values.addressComplement
    );
    setOpen(false);
    if (onSaved) onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forneça as informações de endereço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveAddress)} className="space-y-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        // Only allow numbers and up to 8 digits
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8);
                        field.onChange(value);
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        handleCepBlur(e);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
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
  );
}
