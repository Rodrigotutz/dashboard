"use client";

import "./globals.css";
import { toast, Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const handleOnline = () => {
      toast.dismiss('offline-toast');
      toast.success('Conexão restabelecida', {
        description: 'Você está online novamente',
      });
    };

    const handleOffline = () => {
      toast.error('Sem conexão com a internet', {
        description: 'Verifique sua conexão de rede',
        id: 'offline-toast',
        duration: Infinity,
      });
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <html lang="pt-br">
      <body className="dark bg-neutral-900">
        <ProgressProvider
          color="#fff"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <main>{children}</main>
          <Toaster richColors />
        </ProgressProvider>
      </body>
    </html>
  );
}