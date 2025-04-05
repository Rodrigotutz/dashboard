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

interface CreateCityDialogProps {
  onCityCreated: () => void;
  disabled?: boolean;
}

export function CreateCityDialog({
  onCityCreated,
  disabled,
}: CreateCityDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; label?: string }>({});

  const handleSubmit = async () => {
    setLoading(true);

    const result = await registerCity({ name, label });

    if (result.success) {
      toast.success(result.message);
      setName("");
      setLabel("");
      setOpen(false);
      onCityCreated();
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
          <DialogTitle>Adicionar Nova Cidade</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome da Cidade
            </Label>
            <Input
              disabled={loading}
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Ex: Picos"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="label" className="mb-2">
              Descrição
            </Label>
            <Input
              disabled={loading}
              id="label"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setErrors((prev) => ({ ...prev, label: undefined }));
              }}
              placeholder="Ex: Prefeitura de Picos"
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
            {loading ? "Salvando..." : "Salvar Cidade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
