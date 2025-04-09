"use client";

import Navbar from "@/components/web/navbar";
import { WebSidebar } from "@/components/web/web-sidebar";
import { Menu } from "lucide-react";
import React from "react";
import "./scrollbar.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-[#0a0a0a]">
      <header className="hidden md:block">
        <Navbar />
      </header>
      <SidebarProvider defaultOpen={false} className="relative">
        <aside className="md:hidden">
          <SidebarTrigger className="absolute md:hidden top-0 left-0 z-50 text-neutral-900">
            <Menu size={24} />
          </SidebarTrigger>
          <WebSidebar />
        </aside>

        <main className="light w-full md:pt-0">{children}</main>
      </SidebarProvider>
    </div>
  );
}
