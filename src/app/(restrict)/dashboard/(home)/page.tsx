"use client";

import { Session } from "@/@interfaces/session";
import { useEffect, useState } from "react";

export default function Page() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    }

    fetchSession();
  }, []);

  return (
    <div className="w-full h-[90vh] flex items-center justify-center">
      <h2 className="text-4xl font-bold"></h2>
    </div>
  );
}
