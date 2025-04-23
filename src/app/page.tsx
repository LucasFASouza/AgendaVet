import { AddressDialog } from "@/components/home/AddressDialog";
import { AppointmentForm } from "@/components/home/AppointmentForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Realizar agendamento</h1>
        <Suspense fallback={<p>Carregando formulário...</p>}>
          <AppointmentForm />
        </Suspense>
      </div>
      <AddressDialog />
    </div>
  );
}
