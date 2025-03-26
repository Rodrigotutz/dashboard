import { User } from "@/types/user";
import db from "./db";
import { compareSync } from "bcrypt-ts";

export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return null;
  }
  const passwordMatch = compareSync(password, user.password);
  if (passwordMatch) {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      type: user.type,
      createdAt: user.createdAt.toISOString(),
    };
  }
  return null;
}
