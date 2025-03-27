"use server";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";
import { ConfirmRegisterEmail } from "../email/ConfirmRegisterEmail";

async function sendEmail(user: User) {
  if (!user.confirmCode) {
    return;
  }
  const confirmEmail = new ConfirmRegisterEmail();
  try {
    await confirmEmail.execute(user.name, user.email, user.confirmCode);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default async function registerAction(
  formData: FormData,
  isAdmin: boolean = false
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    name: string;
    email: string;
    password: string;
    admin?: string;
  };

  const userAdmin = data.admin === "on";

  if (!data.name || !data.email || !data.password) {
    return { success: false, message: "Preencha todos os campos" };
  }

  if (data.password.length < 8) {
    return {
      success: false,
      message: "A senha deve ter pelo menos 8 caracteres",
    };
  }

  const findUser = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (findUser) {
    return { success: false, message: "Esse email já está em uso!" };
  }

  const user: User = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashSync(data.password),
      confirmed: isAdmin,
      confirmCode: isAdmin
        ? null
        : Math.floor(100000 + Math.random() * 900000).toString(),
      type: data.admin ? "admin" : "user",
    },
  });

  if (!isAdmin) {
    try {
      await sendEmail(user);
    } catch (error) {
      return {
        success: false,
        message: "Não foi possível enviar o email, solicite um novo código",
        type: 'email-failure'
      };
    }
  }

  return {
    success: true,
    message: isAdmin
      ? "Usuário cadastrado com sucesso!"
      : "Enviamos um e-mail com o código de confirmação",
  };
}
