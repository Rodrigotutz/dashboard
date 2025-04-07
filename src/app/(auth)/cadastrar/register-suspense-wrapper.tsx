"use client";

import RegisterUser from "@/components/user/registerUser";
import { BsGearFill } from "react-icons/bs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterSuspenseWrapper() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const nameParam = searchParams.get("name");
    const emailParam = searchParams.get("email");

    if (error === "usuario_nao_encontrado") {
      toast.error("Usuário não encontrado. Por favor, cadastre-se.");
    }

    if (nameParam) setName(nameParam);
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  return (
    <RegisterUser defaultName={name} defaultEmail={email}>
      <BsGearFill /> Crie sua conta
    </RegisterUser>
  );
}
