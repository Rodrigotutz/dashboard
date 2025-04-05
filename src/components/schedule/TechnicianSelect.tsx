import { User } from "@/@types/user";
import { getAllUsers } from "@/@utils/auth/getUsers";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicianSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function TechnicianSelect({ value, onChange }: TechnicianSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await getAllUsers();
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Select onValueChange={onChange} value={value} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Carregando..." : "Selecione um técnico"}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Carregando usuários...
          </SelectItem>
        ) : (
          users.map((user) => (
            <SelectItem key={user.id} value={user.name}>
              {user.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}