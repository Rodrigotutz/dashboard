"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import registerAction from "@/@actions/auth/registerAction";
import { toast } from "sonner";
import PassowordInput from "@/components/form/password-input";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterUserProps {
  children?: React.ReactNode;
  isAdmin?: boolean;
  onSuccess?: () => void;
  defaultName?: string;
  defaultEmail?: string;
}

export default function RegisterUser({
  children,
  isAdmin,
  onSuccess,
  defaultName = "",
  defaultEmail = "",
}: RegisterUserProps) {
  const router = useRouter();
  const isGoogle = !!defaultName && !!defaultEmail;
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: defaultName,
    email: defaultEmail,
  });

  useEffect(() => {
    setFormData({ name: defaultName, email: defaultEmail });

    const error = searchParams.get("error");
    if (error === "usuario_nao_encontrado") {
      toast.error("Usuário não encontrado. Cadastre-se para continuar.");
    }
  }, [defaultName, defaultEmail, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = new FormData(event.target as HTMLFormElement);
    if (isGoogle) form.append("google", "true");

    const result = await registerAction(form, isAdmin);

    if (!result.success) {
      toast.error(result.message, { duration: result.duration });
      setLoading(false);
      return;
    }

    toast.success(result.message);
    setLoading(false);
    onSuccess?.();

    if (isGoogle || isAdmin) {
      router.push("/login");
    } else {
      router.push("/confirmar");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="flex items-center gap-2 font-bold text-2xl mb-5 justify-center">
        {children}
      </h2>
      <div className="mb-3">
        <Label htmlFor="name" className="mb-1">
          Nome:
        </Label>
        <Input
          name="name"
          type="text"
          id="name"
          disabled={loading}
          placeholder="Insira o nome"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="email" className="mb-1">
          Email:
        </Label>
        <Input
          name="email"
          type="email"
          id="email"
          disabled={loading}
          placeholder="Insira o e-mail"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <PassowordInput disabled={loading} />
      {isAdmin ? (
        <div className="flex gap-2 mt-5">
          <Checkbox name="admin" id="admin" />
          <Label htmlFor="admin">Administrador</Label>
        </div>
      ) : null}
      <Button type="submit" className="w-full mt-5" disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
            Cadastrando...
          </div>
        ) : (
          "Cadastrar"
        )}
      </Button>
    </form>
  );
}
