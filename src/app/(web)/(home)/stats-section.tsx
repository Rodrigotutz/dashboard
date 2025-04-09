const stats = [
  {
    name: "Publicações ativas",
    value: "100+",
    description: "Dicas e artigos disponíveis para seus usuários",
  },
  {
    name: "Agendamentos mensais",
    value: "50+",
    description: "Publicações programadas automaticamente",
  },
  {
    name: "Usuários ativos",
    value: "1K+",
    description: "Colaboradores utilizando o sistema",
  },
  {
    name: "Tempo economizado",
    value: "80%",
    description: "Redução no tempo de gerenciamento",
  },
];

export function StatsSection() {
  return (
    <div className="mt-32 sm:mt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-neutral-800 pb-10">
        <div className="mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Gerencie seu site com ferramentas poderosas e intuitivas.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start w-full max-w-sm"
                >
                  <h3 className="text-base font-semibold text-white">
                    {stat.name}
                  </h3>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-base text-gray-400">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
