export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  confirmed?: boolean | null;
  confirmCode?: string | null;
  createdAt: string | Date;
  type: "admin" | "user" 
};
