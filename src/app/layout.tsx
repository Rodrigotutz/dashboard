"use client";

import "./globals.css";
import { toast, Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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