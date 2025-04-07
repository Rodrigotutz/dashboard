import { Suspense } from "react";
import RegisterSuspenseWrapper from "./register-suspense-wrapper";

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center p-5">
      <div className="z-10 bg-neutral-950 w-full md:w-[400px] border shadow-2xl py-10 px-5 rounded">
        <Suspense fallback={null}>
          <RegisterSuspenseWrapper />
        </Suspense>
      </div>
      <div className="z-10 text-white text-sm">
        <span>Já tem uma conta? </span>
        <span>
          <a href="/login" className="font-bold">
            Faça login
          </a>
        </span>
      </div>
    </div>
  );
}
