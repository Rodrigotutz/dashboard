"use client";

import "./globals.css";
import { toast, Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.dismiss('offline-toast');
      toast.success('Conexão restabelecida');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Sem conexão com a internet', {
        id: 'offline-toast',
        duration: Infinity,
      });
    };

    setIsOnline(navigator.onLine);
    if (!navigator.onLine) handleOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  return (
    <html lang="pt-br" className="dark">
      <body>
        <ProgressProvider
          color="#fff"
          height="4px"
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