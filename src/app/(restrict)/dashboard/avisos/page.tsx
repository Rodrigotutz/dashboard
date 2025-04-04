"use client";

import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";

import {
  Calendar as CalendarIcon,
  Check,
  Info,
  PlusCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { format } from "date-fns";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DraggableCard({
  item,
}: {
  item: { id: string; title: string; description: string; date?: Date };
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="w-full min-h-24 shadow-2xl bg-white rounded-md p-5 cursor-grab flex flex-col"
    >
      <h4 className="font-bold text-blue-500 border-b text-center border-blue-200 pb-3">
        {item.title}
      </h4>
      <p className="text-sm text-gray-600 pt-3 text-justify mb-5">
        {item.description}
      </p>
      {item.date && (
        <p className="text-xs text-blue-500 pt-2 text-center pb-2 underline">
          Agendado para: {format(new Date(item.date), "PPP", { locale: ptBR })}
        </p>
      )}
    </div>
  );
}

export default function Page() {
  const [date, setDate] = useState<Date | undefined>();
  const [userCity, setUserCity] = useState("");
  const [newAlerts, setNewAlerts] = useState<
    { id: string; title: string; description: string; date?: Date }[]
  >([]);
  const [weeklyAlerts, setWeeklyAlerts] = useState<
    { id: string; title: string; description: string; date?: Date }[]
  >([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setNewAlerts((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user.trim()) return;
    setNewAlerts([
      ...newAlerts,
      {
        id: Date.now().toString(),
        title: `${title} - ${user}  (${userCity})`,
        description,
        date,
      },
    ]);
    setTitle("");
    setUser("");
    setUserCity("");
    setDescription("");
    toast.info("Você tem um novo aviso!");
    setIsOpen(false);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="mt-5">
        <div className="pb-5 flex items-center justify-between">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Info /> Avisos
          </h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusCircle /> Novo Aviso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Aviso</DialogTitle>
                <form onSubmit={handleSubmit}>
                  <div className="mt-5">
                    <Label className="mb-2" htmlFor="tipo-aviso">
                      Tipo do Aviso
                    </Label>
                    <Select onValueChange={setTitle} value={title}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent id="tipo-aviso">
                        <SelectItem value="Visita Técnica">
                          Visita Técnica
                        </SelectItem>
                        <SelectItem value="Instalação">Instalação</SelectItem>
                        <SelectItem value="Treinamento">Treinamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-5">
                    <Label className="mb-2" htmlFor="usuario">
                      Usuário
                    </Label>
                    <Select onValueChange={setUser} value={user}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent id="usuario">
                        <SelectItem value="Rodrigo Tutz">
                          Rodrigo Tutz
                        </SelectItem>
                        <SelectItem value="João Manoel">João Manoel</SelectItem>
                        <SelectItem value="Antonio Mesquita">
                          Antonio Mesquita
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-5">
                    <Label className="mb-2" htmlFor="cliente">
                      Cliente / Cidade
                    </Label>
                    <Select onValueChange={setUserCity} value={userCity}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um cliente ou cidade" />
                      </SelectTrigger>
                      <SelectContent id="cliente">
                        <SelectItem value="Picos">Picos</SelectItem>
                        <SelectItem value="Fronteiras">Fronteiras</SelectItem>
                        <SelectItem value="São Luiz">São Luiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-5">
                    <Label className="mb-2" htmlFor="description">
                      Descrição
                    </Label>
                    <Input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descrição do aviso"
                    />
                  </div>

                  <div className="mt-5">
                    <Label className="mb-2">Agendamento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma Data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          locale={ptBR}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="mt-5">
                    <Button type="submit" className="w-full">
                      Salvar Aviso
                    </Button>
                  </div>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-5 flex justify-between gap-10 ">
          <div className="min-h-[500px] w-2/5 rounded-md border-2 p-5 flex flex-col gap-10">
            <h3 className="text-center text-lg font-bold flex items-center justify-center gap-1">
              <Check size={18} /> Novos avisos
            </h3>
            <SortableContext
              items={newAlerts}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-5 font-bold">
                {newAlerts.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </div>

          <div className="w-full min-h-96 rounded-md border-2 p-5 flex flex-col gap-10">
            <h3 className="text-center font-bold text-lg flex gap-2 items-center">
              <CalendarIcon /> Todos os Avisos da Semana:
            </h3>
            <SortableContext
              items={weeklyAlerts}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-5">
                {weeklyAlerts.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
