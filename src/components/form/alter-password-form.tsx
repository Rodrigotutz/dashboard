"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { alterPasswordAction } from "@/actions/auth/alterPasswordAction";
import Form from "next/form";
import PassowordInputs from "@/components/form/password-input";
import { useRouter } from "next/navigation";

export default function AlterPasswordForm({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("userId", userId.toString());
    const result = await alterPasswordAction(formData);

    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
    }

    if (result.type === "info") {
      toast.info(result.message);
      setLoading(false);
    }

    toast.success(result.message);
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-5 md:p-0">
      <div className="z-10 bg-neutral-950 w-[500px] p-5 rounded flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold mb-2">Altere sua senha</h2>
          <p className="text-sm">Informe sua nova senha</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <PassowordInputs />
          </div>
          <div className="mt-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                  Salvando...
                </div>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
