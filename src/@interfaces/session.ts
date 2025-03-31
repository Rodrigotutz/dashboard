export interface Session {
  user?: {
    name?: string;
    email?: string;
    id?: string;
    type: "admin" | "user";
  };
}
