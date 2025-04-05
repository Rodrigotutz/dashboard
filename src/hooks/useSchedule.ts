import { getSchedules } from "@/@actions/schedule/getSchedules";
import { ScheduleItem } from "@/@types/schedule";
import { useState } from "react";
import { toast } from "sonner";

export function useSchedule() {
  const [newAlerts, setNewAlerts] = useState<ScheduleItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<any>([]);

  const refreshSchedules = async () => {
    setLoading(true);
    try {
      const result = await getSchedules();
      if (result.success) {
        setSchedules(result.data);
      }
    } catch (error) {
      console.error("Erro ao atualizar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !user.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const city = userCity.trim() || "Cidade não informada";

    setNewAlerts([
      ...newAlerts,
      {
        id: Date.now().toString(),
        title: `${title.trim()} - ${user.trim()} (${city})`,
        description: description.trim(),
        date,
      },
    ]);

    setTitle("");
    setUser("");
    setUserCity("");
    setDescription("");
    setDate(undefined);

    toast.success("Agendamento criado com sucesso!");

    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    newAlerts,
    setNewAlerts,
    title,
    setTitle,
    description,
    setDescription,
    user,
    setUser,
    userCity,
    setUserCity,
    date,
    setDate,
    handleSubmit,
  };
}
