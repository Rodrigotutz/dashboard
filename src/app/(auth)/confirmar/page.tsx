"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import verifyCodeAction from "@/utils/auth/verifyCode";

export default function Page() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      setCode(pastedData.split(""));
    } else {
      toast.error("O código colado deve conter exatamente 6 dígitos.");
    }
  };

  const handleSubmit = () => {
    if (code.some((digit) => digit === "")) {
      toast.error("Preencha todos os campos com os 6 dígitos.");
      return;
    }

    const confirmCodeString = code.join("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("code", confirmCodeString);

      const result = await verifyCodeAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/");
    });
  };

  const handleNewCode = () => {
    toast.error("Entre em contato com o administrador do sistema")
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="z-10 text-center">
        <h1 className="text-2xl font-bold">Confirme seu e-mail</h1>
        <p>
          Te enviamos um e-mail com o código de confirmação, informe o código
          recebido abaixo
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-10 w-full flex flex-col justify-center items-center"
        >
          <div className="w-full flex justify-center items-center gap-5">
            {code.map((digit, index) => (
              <Input
                className="w-12 h-12 text-center"
                key={index}
                id={`input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength={1}
                disabled={loading}
              />
            ))}
          </div>
          <div className="mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Confirmar E-mail"}
            </Button>
          </div>
        </form>
        <div className="mt-5 text-neutral-500 underline" onClick={handleNewCode}>
          <Button variant={"link"} className="text-neutral-700 cursor-pointer">Solicitar novo código</Button>
        </div>
      </div>
    </div>
  );
}
