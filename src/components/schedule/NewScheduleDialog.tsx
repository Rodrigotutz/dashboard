"use client";

import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

interface NewScheduleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: {
    title: string;
    type: string;
    description: string;
    user: string;
    userCity: string;
    date: Date | undefined;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      type: string;
      description: string;
      user: string;
      userCity: string;
      date: Date | undefined;
    }>
  >;
  handleSubmit: (e: React.FormEvent) => void;
}

export function NewScheduleDialog({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  handleSubmit,
}: NewScheduleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <Label htmlFor="type" className="mb-2">
              Tipo
            </Label>
            <TypeSelect
              value={formData.type}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="technician" className="mb-2">
              Técnico
            </Label>
            <TechnicianSelect
              value={formData.user}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, user: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="city">Cidade</Label>
            <CitySelect
              value={formData.userCity}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, userCity: value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
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
            <Label htmlFor="date" className="mb-2">
              Data
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
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
                    setFormData((prev) => ({ ...prev, date }))
                  }
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
