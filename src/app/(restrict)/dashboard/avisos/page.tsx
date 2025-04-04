"use client";

import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Info, PlusCircle } from "lucide-react";
import Link from "next/link";

function DraggableCard({
  item,
}: {
  item: { id: string; title: string; description: string };
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="w-full min-h-24 bg-white rounded-md p-3 shadow cursor-grab flex flex-col"
    >
      <h4 className="font-bold">{item.title}</h4>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
  );
}

export default function Page() {
  const [newAlerts, setNewAlerts] = useState([
    { id: "1", title: "Novo Aviso 1", description: "Visitar Timon" },
    { id: "2", title: "Novo Aviso 2", description: "Instalar SCPI 9 VM 18" },
  ]);

  const [weeklyAlerts, setWeeklyAlerts] = useState([
    {
      id: "4",
      title: "Aviso da Semana 1",
      description: "Resumo do aviso semanal 1.",
    },
    {
      id: "5",
      title: "Aviso da Semana 2",
      description: "Resumo do aviso semanal 2.",
    },
    {
      id: "6",
      title: "Aviso da Semana 3",
      description: "Resumo do aviso semanal 3.",
    },
    {
      id: "7",
      title: "Aviso da Semana 4",
      description: "Resumo do aviso semanal 4.",
    },
    {
      id: "8",
      title: "Aviso da Semana 5",
      description: "Resumo do aviso semanal 5.",
    },
  ]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setNewAlerts((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });

    setWeeklyAlerts((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="mt-5">
        <div className="border-b pb-5 flex items-center justify-between">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Info /> Avisos
          </h2>
          <Link href={"/dashboard/avisos/novo"}>
            <Button variant={"default"}>
              <PlusCircle /> Novo Aviso
            </Button>
          </Link>
        </div>

        <div className="p-5 flex justify-between gap-10">
          <div className="min-h-[500px] w-1/4 rounded-md border-2 p-5 flex flex-col gap-10">
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
              <Calendar /> Todos os Avisos da Semana:
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
