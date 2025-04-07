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
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signIn("google", { callbackUrl: "/dashboard" });
      if (result?.error) {
        toast.error("Falha no login com Google");
      }
    } catch (error) {
      toast.error("Ocorreu um erro durante o login");
    } finally {
      setGoogleLoading(false);
    }
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
            disabled={loading || googleLoading}
            placeholder="Insira seu e-mail"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <PassowordInput disabled={loading || googleLoading} />
        <div className="mb-5">
          <Link href={"/esqueci"} className="text-xs underline">
            Esqueci minha senha
          </Link>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                Enviando...
              </div>
            ) : (
              "Entrar com Email"
            )}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-2 text-gray-400 text-sm">OU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer gap-2"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <div className="flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                Entrando...
              </div>
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                Entrar com Google
              </>
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
