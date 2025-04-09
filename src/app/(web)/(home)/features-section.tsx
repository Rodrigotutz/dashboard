import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  {
    name: "Gerenciamento de Conteúdo",
    description:
      "Cadastre e organize dicas, artigos e publicações de forma simples e eficiente.",
    href: "/dashboard/content",
    linkText: "Ver conteúdo",
  },
  {
    name: "Agendamentos",
    description:
      "Programe publicações e eventos com nosso sistema de agendamento inteligente.",
    href: "/dashboard/schedule",
    linkText: "Agendar agora",
  },
  {
    name: "Controle de Usuários",
    description:
      "Gerencie permissões e acessos de todos os usuários do sistema.",
    href: "/dashboard/users",
    linkText: "Gerenciar usuários",
  },
];

export function FeaturesSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-col rounded-2xl p-8 bg-white/5 ring-1 ring-white/10 backdrop-blur-md transition hover:ring-white/20"
            >
              <h3 className="text-base font-semibold text-white">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-4 inline-flex items-center text-sm font-medium text-white/90"
              >
                {feature.linkText}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
