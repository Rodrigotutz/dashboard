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
import { createSchedule } from "@/@actions/schedule/createSchedule";
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
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    user: "",
    userCity: "",
    date: undefined as Date | undefined,
  });
  const calendarRef = useRef<any>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getSchedules();

      if (result.success) {
        setSchedules(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const calendarEvents = useMemo(() => {
    return schedules.map((schedule) => ({
      id: schedule.id.toString(),
      title: schedule.client || "Sem título",
      type: schedule.client || "Sem título",
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
    setFormData((prev) => ({ ...prev, date: info.date }));
    setSelectedDate(info.date);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !formData.date ||
        !formData.title ||
        !formData.user ||
        !formData.userCity
      ) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const result = await createSchedule({
        typeId: Number(formData.title),
        userId: Number(formData.user),
        cityId: Number(formData.userCity),
        client: "Cliente",
        description: formData.description,
        scheduledDate: formData.date as Date,
      });

      if (result.success) {
        await fetchSchedules();
        setIsOpen(false);
        setFormData({
          title: "",
          type: "",
          description: "",
          user: "",
          userCity: "",
          date: undefined,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.log("Erro ao criar agendamento:", error);
      toast.error("Tente novamente mais tarde");
    }
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
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />

      <div className="p-5 flex justify-between gap-10">
        <div className="w-2/5 rounded-md border-2 p-5 flex flex-col">
          <h3 className="text-center text-lg font-bold flex items-center justify-center gap-1 mb-5">
            <CalendarIcon size={18} /> Agendamentos do Dia
          </h3>
          <div className="overflow-y-auto flex-1 pr-2">
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
                        <h3 className="font-medium">{item.client}</h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
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
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(item.scheduledDate, "HH:mm", { locale: ptBR })}
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
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Carregando calendário...
            </div>
          ) : calendarEvents.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sem eventos para exibir
            </div>
          ) : (
            <FullCalendar
              dayMaxEventRows={2}
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={ptBrLocale}
              events={calendarEvents}
              height="auto"
              contentHeight="auto"
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
  );
}
