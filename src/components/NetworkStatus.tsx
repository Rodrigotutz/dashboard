"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleOnline = () => {
      setIsOnline(true);
      toast.dismiss("network-status");
      toast.success("Conexão restabelecida", { duration: 3000 });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Você está offline", {
        id: "network-status",
        duration: Infinity,
        action: {
          label: "Tentar novamente",
          onClick: () => window.location.reload(),
        },
      });
    };

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <div
        className={`w-3 h-3 rounded-full ${
          isOnline ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
    </div>
  );
}
