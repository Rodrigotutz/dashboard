import { getTypes } from "@/@actions/schedule/getType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CreateTypeDialog } from "./CreateTypeDialog";
import { toast } from "sonner";

interface TypesSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TypeSelect({ value, onChange, disabled }: TypesSelectProps) {
  const [types, setTypes] = useState<{ title: string; id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      const result = await getTypes({ activeOnly: true });

      if (result.success) {
        const formattedTypes = result.data.map((type) => ({
          title: String(type.title),
          id: String(type.id),
        }));

        setTypes(formattedTypes);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos:", error);
      toast.error("Erro ao carregar tipos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const isEmpty = !loading && types.length === 0;

  return (
    <div className="flex w-full">
      <Select
        onValueChange={onChange}
        value={value}
        disabled={loading || isEmpty}
      >
        <SelectTrigger className="w-full rounded-r-none" disabled={disabled}>
          <SelectValue
            placeholder={
              loading
                ? "Carregando tipos..."
                : isEmpty
                  ? "Nenhum tipo disponível"
                  : "Selecione um tipo"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Carregando tipos...
            </SelectItem>
          ) : isEmpty ? (
            <SelectItem value="no-types" disabled>
              Nenhum tipo cadastrado
            </SelectItem>
          ) : (
            types.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <CreateTypeDialog onTypeCreated={fetchTypes} disabled={disabled} />
    </div>
  );
}
