"use client";
import PassowordInput from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginAction from "@/@actions/auth/loginAction";
import Link from "next/link";
import { useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);
    const result = await loginAction(data);

    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    if (result.type === "info") {
      toast.info(result.message);
    } else {
      toast.success(result.message);
    }
    setLoading(false);
    router.push("/dashboard");
  };
  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="z-10 w-full md:w-[400px] bg-neutral-950 border shadow-2xl py-10 px-5 rounded"
      >
        <h2 className="flex items-center gap-2 font-bold text-2xl mb-5 justify-center">
          <BsGearFill /> Acesse o Sistema
        </h2>
        <div className="mb-3">
          <Label htmlFor="email" className="mb-2">
            Email:
          </Label>
          <Input
            name="email"
            type="email"
            id="email"
            disabled={loading}
            placeholder="Insira seu e-mail"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <PassowordInput disabled={loading} />
        <div className="mb-5">
          <Link href={"/esqueci"} className="text-xs underline">
            Esqueci minha senha
          </Link>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                Enviando...
              </div>
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      </form>

      <div className="text-white text-sm z-10">
        <span>Ainda não tem uma conta? </span>
        <span>
          <Link href={"/cadastrar"} className="font-bold">
            Cadastre-se
          </Link>
        </span>
      </div>
    </div>
  );
}
