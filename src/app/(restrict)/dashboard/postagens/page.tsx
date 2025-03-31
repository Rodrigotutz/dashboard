"use client"

import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Newspaper, PlusCircle } from "lucide-react";
import { columns } from "./columns";
import Link from "next/link";

export default function Page() {
    const [posts, setPosts] = useState([])
    return (
        <div className="mt-5">
            <div className="border-b pb-5 flex items-center justify-between">
                <h2 className="font-bold text-xl flex items-center gap-2">
                    <Newspaper /> Postagens
                </h2>
                <Link href={"/dashboard/postagens/post"}><Button variant={"default"}><PlusCircle /> Nova Postagem</Button></Link>
            </div>


            <DataTable data={posts} columns={columns} />
        </div>
    )
}