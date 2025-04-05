"use client";

import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
  });

  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, date: selectedDate || undefined }));
    }
  }, [selectedDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData)

    if (
      !formData.date ||
      !formData.type ||
      !formData.user ||
      !formData.description ||
      !formData.city
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);

      const result = await createSchedule({
        typeId: Number(formData.type),
        userId: Number(formData.user),
        cityId: Number(formData.city),
        client: "Cliente",
        description: formData.description,
        scheduledDate: formData.date,
      });

      if (result.success) {
        toast.success("Agendamento criado com sucesso");
        onScheduleCreated();
        setFormData({
          type: "",
          description: "",
          user: "",
          city: "",
          date: selectedDate || undefined,
        });
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro ao criar agendamento");
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
            <Label htmlFor="type">Tipo</Label>
            <TypeSelect
              disabled={loading}
              value={formData.type}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="technician">Técnico</Label>
            <TechnicianSelect
              disabled={loading}
              value={formData.user}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, user: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="city">Cidade</Label>
            <CitySelect
              disabled={loading}
              value={formData.city}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, city: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
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

          <div>
            <Label htmlFor="date">Data</Label>
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
