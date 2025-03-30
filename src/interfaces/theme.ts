import { User } from "@/types/user";

export interface Theme {
  id: number;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  error: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
}
