import NotFound from "@/../public/errors/not-found.png";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-5 bg-white">
      <Image
        src={NotFound}
        alt="Página Não Encontrada"
        className="w-44 md:w-[500px]"
      />
      <p className="text-xl text-neutral-800">
        Oops, Não foi possível acessar a página
      </p>
      <Link
        href={"/"}
        className="bg-neutral-800 text-white py-2 px-5 rounded"
      >
        Página Inicial
      </Link>
    </div>
  );
}
