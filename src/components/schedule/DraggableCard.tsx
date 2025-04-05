import { Schedule } from "@/@interfaces/schedule";
import { useSortable } from "@dnd-kit/sortable";
import { isBefore, startOfToday } from "date-fns";

interface DraggableCardProps {
  item: Schedule;
}

export function DraggableCard({ item }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
  };

  const isResolved = isBefore(new Date(item.scheduledDate), startOfToday());

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="border bg-neutral-950 rounded-lg p-4 cursor-grab"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{item.user.name}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        {isResolved ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Resolvido
          </span>
        ) : (
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
        )}
      </div>
      <div className="mt-2 flex items-center text-sm">
        <span className="text-gray-700">Tipo:</span>
        <span className="ml-1 font-medium">{item.type.title}</span>
      </div>
      <div className="mt-1 flex items-center text-sm">
        <span className="text-gray-700">Cidade:</span>
        <span className="ml-1 font-medium">{item.city.name}</span>
      </div>
    </div>
  );
}
