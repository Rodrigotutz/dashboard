"use client";

import Post from "@/components/post/post";
import { CheckCheck } from "lucide-react";

export default function Page() {
  return (
    <Post type="dica">
      <CheckCheck /> Nova Dica
    </Post>
  );
}
