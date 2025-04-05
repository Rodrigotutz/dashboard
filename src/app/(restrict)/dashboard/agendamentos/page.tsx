"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ptBR } from "date-fns/locale";
import { format, isBefore, isSameDay, startOfToday } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewScheduleDialog } from "@/components/schedule/NewScheduleDialog";
import { getSchedules } from "@/@actions/schedule/getSchedules";
import { toast } from "sonner";

interface Schedule {
  id: number;
  type: {
    id: number;
    title: string;
  };
  city: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
  client: string;
  description: string;
  scheduledDate: Date;
  status: string;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<any>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const lastClickedRef = useRef<number | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getSchedules();
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
    fetchSchedules();
  }, []);

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

  const handleDateClick = (info: { date: Date }) => {
    const now = Date.now();
    if (
      lastClickedRef.current &&
      now - lastClickedRef.current < 400 &&
      isSameDay(info.date, selectedDate ?? new Date(0))
    ) {
      setIsOpen(true);
    } else {
      setSelectedDate(info.date);
    }
    lastClickedRef.current = now;
  };

  const handleScheduleCreated = () => {
    fetchSchedules();
    setIsOpen(false);
  };

  const renderStatusBadge = (item: Schedule) => {
    const isExpired =
      item.status === "pending" &&
      isBefore(new Date(item.scheduledDate), startOfToday());

    if (isExpired) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          Expirado
        </span>
      );
    }

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          item.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : item.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
        }`}
      >
        {item.status === "pending"
          ? "Pendente"
          : item.status === "confirmed"
            ? "Confirmado"
            : "Cancelado"}
      </span>
    );
  };

  return (
    <div>
      <div className="pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CalendarIcon /> Agendamentos
        </h2>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-2" /> Novo Agendamento
        </Button>
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
            ) : filteredAlerts.length === 0 ? (
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
              <div className="flex flex-col gap-5 font-bold">
                {filteredAlerts.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.user.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      {renderStatusBadge(item)}
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-gray-700">Tipo:</span>
                      <span className="ml-1 font-medium">
                        {item.type.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm">
                      <span className="text-gray-700">Cidade:</span>
                      <span className="ml-1 font-medium">{item.city.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full border-2 rounded-md overflow-hidden custom-calendar">
          <div ref={calendarContainerRef}>
            {loading ? (
              <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
                Carregando calendário...
              </div>
            ) : calendarEvents.length === 0 ? (
              <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
                Sem eventos para exibir
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
