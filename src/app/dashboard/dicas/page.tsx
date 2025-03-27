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
import { getTips } from "@/utils/dicas/getTips";
import { toast } from "sonner";
import { Message } from "@/types/message";

export default function Page() {
  const [data, setData] = useState<Tips[]>([]);
  const [selectedTip, setSelectedTip] = useState<Tips | null>(null);
  const [loading, setLoading] = useState(true);

  const handleApiResponse = (result: Tips[] | Message) => {
    if (Array.isArray(result)) {
      setData(result);
    } else {
      toast[result.success ? 'success' : 'error'](result.message, {
        duration: result.duration || 5000
      });
      setData([]);
    }
  };

  const fetchTips = async () => {
    try {
      setLoading(true);
      const result = await getTips();
      handleApiResponse(result);
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao processar a requisição");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleNewTipAdded = () => {
    fetchTips();
  };

  return (
    <div className="mt-5 dark">
      <div className="border-b pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CheckCheckIcon /> Dicas do Sistema
        </h2>
        <NewTip onSuccess={handleNewTipAdded} />
      </div>

      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent className="min-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-center mb-5">{selectedTip?.title}</DialogTitle>
          </DialogHeader>
          <div
            className="prose dark:prose-invert max-w-none 
             [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 
             [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700
             overflow-y-auto flex-1"
            dangerouslySetInnerHTML={{ __html: selectedTip?.content || '' }}
          />
          <DialogFooter className="shrink-0 flex justify-between items-center relative mt-5 border-t pt-5">
            <span className="absolute left-0 text-xs">Criado por: {selectedTip?.userName}</span>
            <div className="flex items-center gap-2">
              <Button variant={"link"} className="text-blue-500 cursor-pointer">
                <ThumbsUpIcon />
                <span>{selectedTip?.likes || 0}</span>
              </Button>
              <Button variant={"link"} className="text-red-500 cursor-pointer">
                <ThumbsDown />
                <span>{selectedTip?.dislikes || 0}</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={data}
        onRowClick={setSelectedTip}
      />
    </div>
  );
}