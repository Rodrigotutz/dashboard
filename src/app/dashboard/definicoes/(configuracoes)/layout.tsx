import Link from "next/link";
import { BsGearFill } from "react-icons/bs";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <h2 className="font-bold text-xl flex items-center gap-1  border-b pb-10">
        <BsGearFill size={25} /> Configurações Gerais
      </h2>

      <div className="flex gap-5 mt-5">
        <Link href={"/dashboard/definicoes/"}>Geral</Link>
        <Link href={"/dashboard/definicoes/autenticacao"}>Autenticação</Link>
        <Link href={"/dashboard/definicoes/email"}>Email</Link>
      </div>

      <section className="rounded p-5">{children}</section>
    </div>
  );
}
