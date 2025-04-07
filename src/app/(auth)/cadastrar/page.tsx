"use client";

import RegisterUser from "@/components/user/registerUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function Page() {
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
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center p-5">
      <div className="z-10 bg-neutral-950 w-full md:w-[400px] border shadow-2xl py-10 px-5 rounded">
        <RegisterUser defaultName={name} defaultEmail={email}>
          <BsGearFill /> Crie sua conta
        </RegisterUser>
      </div>
      <div className="z-10 text-white text-sm">
        <span>Já tem uma conta? </span>
        <span>
          <Link href={"/login"} className="font-bold">
            Faça login
          </Link>
        </span>
      </div>
    </div>
  );
}
