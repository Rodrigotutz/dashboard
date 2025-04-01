"use client";

import Post from "@/components/post/post";
import { Info } from "lucide-react";

export default function Page() {
  return (
    <Post type="aviso">
      <Info /> Novo Aviso
    </Post>
  );
}
