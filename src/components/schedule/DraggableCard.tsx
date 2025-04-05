import { ScheduleItem } from "@/@types/schedule";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DraggableCard({ item }: { item: ScheduleItem }) {
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
