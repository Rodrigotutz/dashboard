"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createRoom } from "@/@actions/chat/registerRoomAction";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface CreateRoomDialogProps {
  onRoomCreated: () => void;
}

export function CreateRoomDialog({ onRoomCreated }: CreateRoomDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);
    const result = await createRoom(data);

    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    onRoomCreated();
    toast.success(result.message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-white bg-transparent hover:bg-black/20 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <PlusIcon size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Sala</DialogTitle>
          <form onSubmit={handleSubmit} className="mt-3">
            <Input
              disabled={loading}
              placeholder="Insira o nome da Sala"
              name="name"
            />
            <div className="text-end mt-5">
              <Button disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                    Salvando...
                  </div>
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
