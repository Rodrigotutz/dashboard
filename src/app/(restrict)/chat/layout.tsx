"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <aside>
        <SidebarTrigger className="absolute md:hidden top-0 left-0 z-50 text-white">
          <Menu size={24} />
        </SidebarTrigger>
        <ChatSidebar />
      </aside>
      <section></section>
      <main className="h-screen w-full">
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}


