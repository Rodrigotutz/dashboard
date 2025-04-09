"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  CheckCheckIcon,
  FileText,
  Mail,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const items = [
  {
    title: "Início",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Dicas",
    url: "/dicas",
    icon: CheckCheckIcon,
  },
  {
    title: "Notícias",
    url: "/noticias",
    icon: FileText,
  },
];

const handleSubmit = () => {
  toast.info("Te acalma que não tá funcionando ainda");
};

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-10 mt-15">
      <Separator className="bg-neutral-800 mb-12" />
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xl font-semibold">Rodrigo Tutz</h4>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Criando soluções digitais com performance, acessibilidade e
            excelência em experiência do usuário. Desenvolvimento full-stack com
            foco em Next.js e Laravel.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <ShieldCheck size={18} className="text-green-500" />
            <span className="text-sm text-neutral-400">
              Site seguro e criptografado
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-neutral-400 mb-3">
            Receba dicas e novidades direto no seu e-mail.
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              className="bg-neutral-800 border-none text-white placeholder:text-neutral-500 md:flex-1"
            />
            <Button
              onClick={handleSubmit}
              variant="secondary"
              className="text-white whitespace-nowrap"
            >
              <Send size={16} className="mr-2" />
              Inscrever-se
            </Button>
          </div>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-lg font-semibold mb-4">Navegação</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            {items.map(({ title, url, icon: Icon }) => (
              <li key={url}>
                <Link
                  href={url}
                  className="flex items-center space-x-2 hover:text-white transition"
                >
                  <Icon size={16} />
                  <span>{title}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contato"
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <Mail size={16} />
                <span>Contato</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="mt-12 mb-6 bg-neutral-900" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500 gap-4">
        <div>&copy; {year} Rodrigo Tutz. Todos os direitos reservados.</div>
        <div className="flex space-x-4">
          <Link
            href="/politica-de-privacidade"
            className="hover:text-white transition"
          >
            Política de Privacidade
          </Link>
          <Link href="/termos" className="hover:text-white transition">
            Termos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
}
