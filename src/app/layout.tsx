"use client";

import "./globals.css";
import { Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body>
        <ProgressProvider
          color="#fff"
          height="5px"
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