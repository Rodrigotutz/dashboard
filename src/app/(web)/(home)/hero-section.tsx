import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              Controle total do seu site
            </h1>
            <p className="relative mt-6 text-lg leading-8 text-gray-300 sm:max-w-md lg:max-w-none">
              Dashboard completo para gerenciar conteúdo, usuários e
              agendamentos com facilidade e eficiência.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-lg w-full text-center sm:w-80 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-md hover:bg-white/90 transition"
              >
                Acessar Dashboard
              </Link>
            </div>
          </div>
          <div className="hidden mt-14 sm:flex flex-col sm:flex-row justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
            {[...Array(3)].map((_, colIdx) => (
              <div
                key={colIdx}
                className="w-44 flex-none space-y-8 pt-32 sm:pt-0"
              >
                <div className="aspect-[2/3] w-full rounded-xl bg-white/5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm" />
                <div className="aspect-[2/3] w-full rounded-xl bg-white/5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
