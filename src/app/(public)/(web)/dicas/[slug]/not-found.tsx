import NotFound from "@/../public/errors/tip-not-found.png";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-5 bg-white">
      <Image
        src={NotFound}
        alt="Página Não Encontrada"
        className="w-44 md:w-[400px]"
      />
      <p className="text-xl text-neutral-800">Oops, Dica não encontrada</p>
      <Link
        href={"/dicas"}
        className="bg-blue-800 text-white  py-2 px-5 rounded"
      >
        Voltar para Dicas
      </Link>
    </div>
  );
}
