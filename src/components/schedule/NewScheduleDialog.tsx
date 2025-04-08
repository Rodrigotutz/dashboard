"use client";

import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TechnicianSelect } from "./TechnicianSelect";
import { CitySelect } from "./CitySelect";
import { TypeSelect } from "./TypeSelect";
import { useState, useEffect } from "react";
import { createSchedule } from "@/@actions/schedule/createSchedule";
import { toast } from "sonner";
import { getAllUsers } from "@/@utils/auth/getUsers";
import { Input } from "@/components/ui/input";

interface NewScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDate: Date | null;
  onScheduleCreated: () => void;
}

export function NewScheduleDialog({
  isOpen,
  setIsOpen,
  selectedDate,
  onScheduleCreated,
}: NewScheduleDialogProps) {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    user: "",
    city: "",
    date: undefined as Date | undefined,
    hour: "08:00",
  });

  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialDate = selectedDate || new Date();
      setFormData((prev) => ({
        ...prev,
        date: initialDate,
        hour: format(initialDate, "HH:mm"),
      }));
    }
  }, [selectedDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.type ||
      !formData.user ||
      !formData.description ||
      !formData.city ||
      !formData.hour
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);

      const [hours, minutes] = formData.hour.split(":").map(Number);
      const scheduledDate = new Date(formData.date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      if (formData.user === "all") {
        const usersData = await getAllUsers();
        if (!Array.isArray(usersData)) {
          throw new Error("Não foi possível obter a lista de usuários");
        }

        const results = await Promise.all(
          usersData.map((user) =>
            createSchedule({
              typeId: Number(formData.type),
              userId: Number(user.id),
              cityId: Number(formData.city),
              description: formData.description,
              scheduledDate,
            })
          )
        );

        const failed = results.filter((r) => !r.success);
        if (failed.length > 0) {
          toast.error(
            `Alguns agendamentos falharam (${failed.length}/${results.length})`
          );
        } else {
          toast.success(
            `Agendamentos criados com sucesso para ${results.length} técnicos`
          );
        }
      } else {
        const result = await createSchedule({
          typeId: Number(formData.type),
          userId: Number(formData.user),
          cityId: Number(formData.city),
          description: formData.description,
          scheduledDate,
        });

        if (result.success) {
          toast.success("Agendamento criado com sucesso");
        } else {
          toast.error(result.message);
        }
      }

      onScheduleCreated();
      setFormData({
        type: "",
        description: "",
        user: "",
        city: "",
        date: selectedDate || undefined,
        hour: "08:00",
      });
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <Label htmlFor="type" className="mb-2">Tipo</Label>
            <TypeSelect
              disabled={loading}
              value={formData.type}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="technician" className="mb-2">Técnico</Label>
            <TechnicianSelect
              disabled={loading}
              value={formData.user}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, user: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="city" className="mb-2">Cidade</Label>
            <CitySelect
              disabled={loading}
              value={formData.city}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, city: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">Descrição</Label>
            <Textarea
              id="description"
              disabled={loading}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descreva o agendamento"
              className="min-h-[100px]"
            />
          </div>  

          <div className="flex gap-5 justify-between">
            <div className="w-full">
              <Label htmlFor="date" className="mb-2">Data</Label>
              <Popover>
                <PopoverTrigger asChild disabled={loading}>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: date || undefined,
                      }))
                    }
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full">
              <Label htmlFor="hour" className="mb-2">Hora</Label>
              <div className="relative w-full">
                <Input
                  type="time"
                  id="hour"
                  value={formData.hour}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hour: e.target.value,
                    }))
                  }
                  className="w-full"
                  disabled={loading}
                />
                <Clock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Agendar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
