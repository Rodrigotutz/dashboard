import { getCities } from "@/@actions/schedule/getCities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { CreateCityDialog } from "./CreateCityDialog";

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CitySelect({ value, onChange }: CitySelectProps) {
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      const result = await getCities({ activeOnly: true });

      if (result.success) {
        const formattedCities = result.data.map((city) => ({
          value: city.name,
          label: city.label,
        }));

        setCities(formattedCities);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      setError("Erro ao carregar cidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const isEmpty = !loading && cities.length === 0;

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
                ? "Carregando cidades..."
                : isEmpty
                  ? "Nenhuma cidade disponível"
                  : "Selecione uma cidade"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Carregando cidades...
            </SelectItem>
          ) : isEmpty ? (
            <SelectItem value="no-cities" disabled>
              Nenhuma cidade cadastrada
            </SelectItem>
          ) : (
            cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <CreateCityDialog onCityCreated={fetchCities} />
    </div>
  );
}
