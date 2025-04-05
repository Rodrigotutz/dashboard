"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ptBR } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewScheduleDialog } from "@/components/schedule/NewScheduleDialog";
import { getSchedules } from "@/@actions/schedule/getSchedules";
import { toast } from "sonner";
import { Schedule } from "@/@interfaces/schedule";
import { Session } from "@/@interfaces/session";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableCard } from "@/components/schedule/DraggableCard";
import { DeleteScheduleDrop } from "@/components/schedule/deleteScheduleDrop";
import { deleteSchedule } from "@/@actions/schedule/deleteSchedule";
import { CSS } from "@dnd-kit/utilities";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderedAlerts, setOrderedAlerts] = useState<Schedule[]>([]);
  const calendarRef = useRef<any>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const lastClickedRef = useRef<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<Schedule | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const isAdmin = session?.user?.type === "admin";

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = (await res.json()) as Session;
      setSession(data);
    } catch {
      toast.error("Erro ao obter sessão");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      if (!session?.user) return;
      const result = await getSchedules(
        isAdmin ? {} : { userId: Number(session.user.id) }
      );
      if (result.success) {
        setSchedules(result.data);
      }
    } catch {
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      fetchSchedules();
    }
  }, [session]);

  useEffect(() => {
    if (!calendarContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    });
    observer.observe(calendarContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const calendarEvents = useMemo(() => {
    return schedules.map((schedule) => ({
      id: schedule.id.toString(),
      title: schedule.type.title || "Sem título",
      start: new Date(schedule.scheduledDate),
      end: new Date(schedule.scheduledDate),
      extendedProps: {
        description: schedule.description,
        type: schedule.type.title,
        city: schedule.city.name,
        status: schedule.status,
      },
    }));
  }, [schedules]);

  const filteredAlerts = useMemo(() => {
    if (!selectedDate) return [];
    return schedules.filter((item) =>
      isSameDay(new Date(item.scheduledDate), selectedDate)
    );
  }, [schedules, selectedDate]);

  useEffect(() => {
    setOrderedAlerts(filteredAlerts);
  }, [filteredAlerts]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
    const item = orderedAlerts.find((i) => i.id === active.id);
    if (item) setActiveItem(item);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && over.id !== "trash-bin") {
      const oldIndex = orderedAlerts.findIndex((i) => i.id === active.id);
      const newIndex = orderedAlerts.findIndex((i) => i.id === over.id);
      setOrderedAlerts(arrayMove(orderedAlerts, oldIndex, newIndex));
    }

    if (over?.id === "trash-bin") {
      try {
        await deleteSchedule(active.id as number);
        setSchedules(schedules.filter((s) => s.id !== active.id));
        toast.success("Agendamento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        toast.error("Falha ao excluir agendamento");
      }
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const handleDateClick = (info: { date: Date }) => {
    const now = Date.now();
    const doubleClick =
      lastClickedRef.current &&
      now - lastClickedRef.current < 400 &&
      isSameDay(info.date, selectedDate ?? new Date(0));

    if (doubleClick) {
      if (isAdmin) {
        setIsOpen(true);
      }
    } else {
      setSelectedDate(info.date);
    }

    lastClickedRef.current = now;
  };

  const handleScheduleCreated = () => {
    fetchSchedules();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CalendarIcon /> Agendamentos
        </h2>
        {isAdmin && (
          <Button variant="default" onClick={() => setIsOpen(true)}>
            <PlusCircle className="mr-2" /> Novo Agendamento
          </Button>
        )}
      </div>

      <NewScheduleDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedDate={selectedDate}
        onScheduleCreated={handleScheduleCreated}
      />

      <div className="p-5 flex justify-between gap-10">
        <div className="w-2/5 rounded-md border-2 p-5 flex flex-col max-h-[600px] overflow-y-auto">
          <h3 className="text-center text-lg font-bold flex items-center justify-center gap-1 mb-5">
            <CalendarIcon size={18} /> Agendamentos do Dia
          </h3>
          <div className="flex-1 pr-2">
            {loading ? (
              <div className="text-center">Carregando...</div>
            ) : orderedAlerts.length === 0 ? (
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-neutral-600">
                  {selectedDate &&
                    format(selectedDate, "EEEE',' dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                </p>
                <p className="text-muted-foreground">
                  Nenhum agendamento encontrado
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedAlerts.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-5">
                    {orderedAlerts.map((item) => (
                      <DraggableCard key={item.id} item={item} />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeItem ? (
                    <div
                      className="border relative bg-neutral-950 rounded-lg p-4 cursor-grabbing shadow-lg"
                      style={{
                        transform: CSS.Transform.toString({
                          x: 0,
                          y: 0,
                          scaleX: 1,
                          scaleY: 1,
                        }),
                        opacity: 0.8,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {activeItem.user.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {activeItem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
                {session?.user?.type === "admin" && (
                  <DeleteScheduleDrop
                    onDrop={(id) => {
                      if (id !== -1) {
                        handleDragEnd({ active: { id } } as DragEndEvent);
                      }
                    }}
                  />
                )}
              </DndContext>
            )}
          </div>
        </div>

        <div className="w-full border-2 rounded-md overflow-hidden custom-calendar">
          <div ref={calendarContainerRef}>
            {loading ? (
              <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
                Carregando calendário...
              </div>
            ) : (
              <FullCalendar
                dayMaxEventRows={2}
                fixedWeekCount={false}
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={ptBrLocale}
                events={calendarEvents}
                height={600}
                aspectRatio={1.35}
                dayCellContent={(args) => {
                  args.dayNumberText = args.dayNumberText.replace(/^0/, "");
                  return (
                    <div className="fc-daycell-top">
                      <div className="fc-daycell-number">
                        {args.dayNumberText}
                      </div>
                    </div>
                  );
                }}
                headerToolbar={{
                  left: "prev",
                  center: "title",
                  right: "next",
                }}
                buttonText={{
                  today: "Hoje",
                  month: "Mês",
                  week: "Semana",
                  day: "Dia",
                }}
                dateClick={handleDateClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
