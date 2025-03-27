export type Tips = {
  id?: number;
  userId: number;
  userName?: string;
  title: string;
  content: string;
  public?: boolean | null;
  likes?: number | null;
  dislikes?: number | null;
};
