"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import registerAction from "@/utils/auth/registerAction";
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
}

export default function RegisterUser({
  children,
  isAdmin,
  onSuccess,
}: RegisterUserProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);
    const result = await registerAction(data, isAdmin);

    if (!result.success) {
      toast.error(result.message, { duration: result.duration });
      setLoading(false);
      return;
    }

    toast.success(result.message);
    setLoading(false);
    onSuccess?.();

    if (!isAdmin) {
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
          <Label htmlFor="admin" >Administrador</Label>
        </div>
      ) : (
        ""
      )}

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
