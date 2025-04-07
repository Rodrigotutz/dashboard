
export interface Schedule {
  id: number;
  type: {
    id: number;
    title: string;
  };
  city: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
  description: string;
  scheduledDate: Date;
  status: string;
}