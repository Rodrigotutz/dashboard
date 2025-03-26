"use client";

import PassowordInputs from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import registerSmtp from "@/utils/email/registerSmtpAction";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { getSmtpConfig } from "@/utils/email/getSmtpConfig";
import { testSmtpConnection } from "@/utils/email/testSmtp";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    password: "",
    fromAddress: "",
    fromName: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setFetching(true);
        const config = await getSmtpConfig();

        if (config && "host" in config) {
          setFormData({
            host: config.host,
            port: config.port.toString(),
            password: config.password,
            fromAddress: config.fromAddress,
            fromName: config.fromName,
          });
        }
      } catch (error) {
        toast.error("Erro ao carregar configurações SMTP");
      } finally {
        setFetching(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const result = await registerSmtp(formData);

    if (!result.success) {
      setLoading(false);
      toast.error(result.message);
      return;
    }

    setLoading(false);
    toast.success(result.message);
  };

  const handleTestSmtp = async () => {
    setTesting(true);
    try {
      const result = await testSmtpConnection({
        host: formData.host,
        port: Number(formData.port),
        fromAddress: formData.fromAddress,
        password: formData.password,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao testar conexão SMTP");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Configurações de Email</h2>

        <div>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={handleTestSmtp}
            disabled={
              loading ||
              testing ||
              !formData.host ||
              !formData.port ||
              !formData.password ||
              !formData.fromAddress ||
              !formData.fromName
            }
          >
            {testing ? (
              <div className="flex items-center">
                <AiOutlineLoading3Quarters className="animate-spin w-4 h-4 mr-2" />
                Testando...
              </div>
            ) : (
              "Testar"
            )}
          </Button>
        </div>
      </div>

      {fetching ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <h2 className="text-2xl font-bold">Carregando dados...</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 bg-white/5 p-10 rounded-lg">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="mb-5 w-full">
              <Label htmlFor="host" className="mb-1">
                Host:
              </Label>
              <Input
                type="text"
                disabled={loading || testing}
                id="host"
                name="host"
                placeholder="smtp.gmail.com"
                value={formData.host}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5 w-full">
              <PassowordInputs
                disabled={loading || testing}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="mb-5 md:w-1/3">
              <Label htmlFor="port" className="mb-1">
                Porta:
              </Label>
              <Input
                type="text"
                disabled={loading || testing}
                id="port"
                name="port"
                placeholder="587"
                value={formData.port}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col md:flex-row gap-10">
            <div className="w-full">
              <Label className="mb-1">Email:</Label>
              <Input
                type="email"
                id="fromAddress"
                name="fromAddress"
                placeholder="email@gmail.com"
                disabled={loading || testing}
                value={formData.fromAddress}
                onChange={handleChange}
              />
            </div>

            <div className="w-full">
              <Label className="mb-1">Nome:</Label>
              <Input
                type="text"
                disabled={loading || testing}
                id="fromName"
                name="fromName"
                placeholder="João da Silva"
                value={formData.fromName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-end mt-20">
            <Button
              disabled={loading || testing}
              type="submit"
              className="font-bold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                  Salvando...
                </div>
              ) : (
                "Salvar Configurações"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
