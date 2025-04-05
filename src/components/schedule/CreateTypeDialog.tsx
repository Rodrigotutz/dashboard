import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { registerCity } from "@/@actions/schedule/registerCity";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { registerType } from "@/@actions/schedule/registerType";

interface CreateTypeDialogProps {
  onTypeCreated: () => void;
  disabled?: boolean;
}

export function CreateTypeDialog({
  onTypeCreated,
  disabled,
}: CreateTypeDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; label?: string }>({});

  const handleSubmit = async () => {
    setLoading(true);

    const result = await registerType({ title, label });

    if (result.success) {
      toast.success(result.message);
      setTitle("");
      setLabel("");
      setOpen(false);
      onTypeCreated();
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        <Button
          type="button"
          className="rounded-l-none border-l-0"
          variant="outline"
          size="icon"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Tipo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title" className="mb-2">
              Titulo
            </Label>
            <Input
              id="title"
              disabled={loading}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Visita Técnica"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="label" className="mb-2">
              Abreviação
            </Label>
            <Input
              disabled={loading}
              id="label"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setErrors((prev) => ({ ...prev, label: undefined }));
              }}
              placeholder="VT"
              className="mt-1"
            />
            {errors.label && (
              <p className="text-sm text-destructive mt-1">{errors.label}</p>
            )}
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
