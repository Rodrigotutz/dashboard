"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

export default function NewTip() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle /> Nova Dica
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastre uma nova dica</DialogTitle>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="mb-5">
              <Label className="mb-2" htmlFor="title">
                Titulo:
              </Label>
              <Input id="title" name="title" />
            </div>

            <div className="mb-5">
              <Label className="mb-2" htmlFor="content">
                Descrição:
              </Label>
              <Input id="content" name="content" />
            </div>

            <div className="flex gap-2 mb-3">
              <Checkbox name="public" id="public" />
              <Label htmlFor="public">Público</Label>
            </div>

            <div className="text-end">
              <Button className="font-bold">Salvar Dica</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
