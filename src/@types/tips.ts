export type Tips = {
  id?: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  title: string;
  content: string;
  public?: boolean | null;
  likes?: number | null;
  dislikes?: number | null;
  createdAt?: Date
};
