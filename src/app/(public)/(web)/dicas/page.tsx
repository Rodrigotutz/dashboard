"use client";
import { useEffect, useState } from "react";
import { Tips } from "@/@types/tips";
import { Skeleton } from "@/components/ui/skeleton";
import { getTips } from "@/@utils/tips/getTips";
import { useRouter } from "next/navigation";

const extractFirstLineText = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const validTags = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'section'];

    for (const tag of validTags) {
        const element = tempDiv.querySelector(tag);
        if (element && element.textContent?.trim()) {
            return element.textContent.trim();
        }
    }
    return '';
};

const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

export default function Page() {
    const router = useRouter();
    const [tips, setTips] = useState<Tips[]>([]);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        const fetchTips = async () => {
            const data = await getTips();
            if (data) {
                const publicTips = data.filter(tip => tip.public === true);
                setTips(publicTips);
            }
            setLoading(false);
        };
        fetchTips();
    }, []);

    const handleRowClick = (title: string) => {
        setRedirect(true)
        router.push(`/dicas/${title}`);
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto space-y-4">
                <div className="mt-10 mb-10 pb-12 border-b text-center">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Carregando Dicas...</h2>
                    <p>Aguarde enquanto trago as dicas pra você...</p>
                </div>
                <div className="overflow-hidden">
                    <Skeleton className="h-12 w-full bg-neutral-400 rounded-t-lg rounded-b-none" />
                    <Skeleton className="h-20 w-full bg-neutral-300 rounded-t-none" />
                </div>
            </div>
        );
    }

    if (!tips || tips.length === 0) {
        return (
            <div className="pb-10">
                <div className="w-full py-10 bg-neutral-50 flex flex-col items-center justify-center shadow-sm">
                    <h2 className="text-3xl font-bold text-neutral-800 mb-2">Dicas</h2>
                    <p className="text-neutral-600">Acesse todas as dicas disponíveis no sistema!</p>
                </div>
                <div className="w-full max-w-7xl mx-auto mt-8 p-8 text-center">
                    <div className="bg-neutral-800 rounded-lg p-8">
                        <h3 className="text-xl font-medium text-white mb-4">Nenhuma dica encontrada</h3>
                        <p className="text-neutral-200">No momento não há dicas disponíveis.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-10">
            <div className="w-full py-10 bg-neutral-50 flex flex-col items-center justify-center shadow-sm">
                <h2 className="text-3xl font-bold text-neutral-800 mb-2">Dicas Públicas</h2>
                <p className="text-neutral-600">Acesse todas as dicas públicas disponíveis no sistema!</p>
            </div>

            <div className="w-full max-w-7xl mx-auto mt-8 rounded-lg overflow-hidden shadow-md">

                {!redirect ? (
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
                                    onClick={() => handleRowClick(tip.title)}
                                    className={`min-h-16 hover:bg-blue-100 cursor-pointer ${index % 2 === 0 ? 'bg-neutral-200' : 'bg-white'}`}
                                >
                                    <td className="px-6 py-4 font-medium text-neutral-800 truncate">
                                        {tip.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 truncate">
                                        {extractFirstLineText(tip.content).substring(0, 100)}{extractFirstLineText(tip.content).length > 100 && '...'}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-700 truncate">{tip.userName}</td>
                                    <td className="px-6 py-4 text-neutral-500 truncate">
                                        {new Date(tip.createdAt || new Date()).toLocaleDateString('pt-BR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>)
                    : (
                        <div className="h-26 bg-neutral-100 w-full flex items-center justify-center">
                            <h2 className="text-xl text-center">Acessando Dica...</h2>
                        </div>
                    )}
            </div>
        </div>
    );
}