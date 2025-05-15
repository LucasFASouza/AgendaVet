"use client";

import { useState } from "react";
import { deleteTimeslot } from "@/actions/appointmentAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export function ManageSlotsDialog({
  timeslots,
}: {
  timeslots: Array<{
    id: number;
    datetime: Date | string;
    isAvailable: boolean;
  }>;
}) {
  const [open, setOpen] = useState(false);

  const handleDeleteTimeSlot = async (id: number) => {
    await deleteTimeslot(id);
    alert("Horário removido com sucesso.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Gerenciar horários
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Horários</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {timeslots.length === 0 ? (
            <div className="flex justify-center items-center h-20 border rounded-lg">
              <p className="text-gray-500">Sem horários disponíveis.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {timeslots
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
                      Deletar
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
