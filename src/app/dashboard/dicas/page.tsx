"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { CheckCheckIcon, ThumbsDown, ThumbsUpIcon } from "lucide-react";
import { columns } from "./columns";
import NewTip from "@/components/tips/newTip";
import { Tips } from "@/types/tips";

export default function Page() {
  const [data, setData] = useState<Tips[]>([]);
  const [selectedTip, setSelectedTip] = useState<any | null>(null);

  return (
    <div className="mt-5">
      <div className="border-b pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CheckCheckIcon /> Dicas do Sistema
        </h2>

        <NewTip />
      </div>

      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTip?.title}</DialogTitle>
          </DialogHeader>
          <p>{selectedTip?.content}</p>
          <DialogFooter>
            <div className="flex items-center gap-2">
              <Button variant={"link"} className="text-blue-500 cursor-pointer">
                <ThumbsUpIcon />
                <span>{selectedTip?.likes}</span>
              </Button>

              <Button variant={"link"} className="text-red-500 cursor-pointer">
                <ThumbsDown />
                <span>{selectedTip?.dislikes}</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={data} onRowClick={setSelectedTip} />
    </div>
  );
}
