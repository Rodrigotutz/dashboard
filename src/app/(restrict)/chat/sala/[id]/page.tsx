import { Suspense } from "react";
import Chat from "@/components/chat/chat-messages";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="h-screen flex justify-between p-[0.55rem] -ml-2">
      <div className="flex flex-col justify-between bg-neutral-900 p-5 w-full">
        <h3 className="text-white text-2xl">Sala - {id}</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <Chat id={id} />
        </Suspense>
      </div>
    </div>
  );
}
