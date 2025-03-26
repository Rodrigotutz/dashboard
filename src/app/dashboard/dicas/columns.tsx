"use client";

import { Tips } from "@/types/tips";
import { ColumnDef } from "@tanstack/react-table";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

export const columns: ColumnDef<Tips>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
    cell: ({ row }) => truncateText(row.original.title, 50),
  },
  {
    accessorKey: "content",
    header: "Descrição",
    cell: ({ row }) => truncateText(row.original.content, 400),
  },
];
