export type Smtp = {
  host: string;
  port: number;
  password: string;
  fromName: string;
  fromAddress: string;
} | null;
