"use client";

export default function Page() {
    const tips = Array(10).fill(null).map((_, index) => ({
        id: index + 1,
        title: `Dica ${index + 1}: Como usar o SCPI`,
        publishedBy: `Rodrigo Tutz`,
        date: new Date().toLocaleDateString('pt-BR'),
        content: `Esta dica explica como utilizar o recurso ${index + 1} de forma otimizada para melhorar seu fluxo de trabalho.`
    }));

    return (
        <div className="pb-10">
            <div className="w-full py-10 bg-neutral-50 flex flex-col items-center justify-center shadow-sm">
                <h2 className="text-3xl font-bold text-neutral-800 mb-2">Dicas</h2>
                <p className="text-neutral-600">Acesse todas as dicas como instalação, configuração e uso dos sistemas!</p>
            </div>

            <div className="w-full max-w-7xl mx-auto mt-8 rounded-lg overflow-hidden shadow-md">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="bg-neutral-700 text-white">
                            <th className="w-[25%] px-6 py-3 text-left font-medium">Título:</th>
                            <th className="w-[45%] px-6 py-3 text-left">Descrição:</th>
                            <th className="w-[15%] px-6 py-3 text-left">Autor:</th>
                            <th className="w-[15%] px-6 py-3 text-left">Data:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tips.map((tip, index) => (
                            <tr
                                key={tip.id}
                                className={`min-h-16 hover:bg-blue-100 cursor-pointer ${index % 2 === 0 ? 'bg-neutral-200' : 'bg-white'}`}
                            >
                                <td className="px-6 py-4 font-medium text-neutral-800 truncate">{tip.title}</td>
                                <td className="px-6 py-4 text-sm text-neutral-600 truncate">{tip.content}</td>
                                <td className="px-6 py-4 text-neutral-700 truncate">{tip.publishedBy}</td>
                                <td className="px-6 py-4 text-neutral-500 truncate">{tip.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}