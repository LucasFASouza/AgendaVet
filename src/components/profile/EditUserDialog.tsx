"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserInfo, saveUserAddress } from "@/actions/authActions";

export function EditUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    zipCode: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
  });

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const userInfo = await getUserInfo();
        setFormData({
          name: userInfo.name || "",
          zipCode: userInfo.zipCode || "",
          addressStreet: userInfo.addressStreet || "",
          addressNumber: userInfo.addressNumber || "",
          addressComplement: userInfo.addressComplement || "",
        });
      })();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await saveUserAddress(
      formData.name,
      formData.zipCode,
      formData.addressStreet,
      formData.addressNumber,
      formData.addressComplement
    );
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Editar Informações</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Informações do Usuário</DialogTitle>
          </DialogHeader>
          <form>
            <Input
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              className="mb-4"
            />
            <Input
              name="zipCode"
              placeholder="CEP"
              value={formData.zipCode}
              onChange={handleChange}
              className="mb-4"
            />
            <Input
              name="addressStreet"
              placeholder="Rua"
              value={formData.addressStreet}
              onChange={handleChange}
              className="mb-4"
            />
            <Input
              name="addressNumber"
              placeholder="Número"
              value={formData.addressNumber}
              onChange={handleChange}
              className="mb-4"
            />
            <Input
              name="addressComplement"
              placeholder="Complemento"
              value={formData.addressComplement}
              onChange={handleChange}
              className="mb-4"
            />
          </form>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
