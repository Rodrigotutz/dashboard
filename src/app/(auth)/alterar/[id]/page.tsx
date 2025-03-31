import db from "@/lib/db";
import AlterPasswordForm from "@/components/form/alter-password-form";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = id;

  const result = await db.passwordResetToken.findFirst({
    where: { token: token },
    include: { user: true },
  });

  if (!result) {
    redirect("/login");
  }

  const user = result.user;

  return <AlterPasswordForm userId={user.id} />;
}
