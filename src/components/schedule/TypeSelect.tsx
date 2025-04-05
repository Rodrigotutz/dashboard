import { getCities } from "@/@actions/schedule/getCities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getTypes } from "@/@actions/schedule/getType";
import { CreateTypeDialog } from "./CreateTypeDialog";

interface TypesSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function TypeSelect({ value, onChange }: TypesSelectProps) {
  const [types, setTypes] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = async () => {
    try {
      const result = await getTypes({ activeOnly: true });

      if (result.success) {
        const formattedTypes = result.data.map((type) => ({
          value: type.title,
          label: type.label,
        }));

        setTypes(formattedTypes);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos:", error);
      setError("Erro ao carregar tipos");
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
        <SelectTrigger className="w-full rounded-r-none">
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
              <SelectItem key={type.value} value={type.value}>
                {type.value}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <CreateTypeDialog onTypeCreated={fetchTypes} />
    </div>
  );
}
