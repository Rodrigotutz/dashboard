export type Posts = {
  id?: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  title: string;
  category?: string;
  slug: string;
  userType?: string;
  content: string;
  public?: boolean | null;
  likes?: number | null;
  dislikes?: number | null;
  createdAt?: Date;
};
