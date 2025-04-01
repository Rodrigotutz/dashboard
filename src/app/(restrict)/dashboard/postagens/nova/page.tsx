"use client";

import Post from "@/components/post/post";
import { NewspaperIcon } from "lucide-react";

export default function Page() {
  return <Post type="postagem"><NewspaperIcon /> Nova Postagem</Post>;
}
