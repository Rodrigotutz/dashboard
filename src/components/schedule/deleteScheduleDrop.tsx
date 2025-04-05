"use client";

import { useDroppable } from "@dnd-kit/core";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrashBinProps {
  onDrop: (id: number) => void;
  className?: string;
}

export function DeleteScheduleDrop({ onDrop, className }: TrashBinProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "trash-bin",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute -bottom-5 -left-4 p-4 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg z-50",
        isOver ? "bg-red-500 scale-110" : "bg-red-600/50 hover:bg-red-500",
        className
      )}
      onClick={() => isOver && onDrop(-1)}
    >
      <Trash size={15} className="text-white" />
      {isOver && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
          Solte para excluir
        </div>
      )}
    </div>
  );
}
