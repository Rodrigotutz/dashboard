"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import logoutAction from "@/@actions/auth/logoutAction";
import {
  Menu,
  LayoutDashboard,
  FileText,
  LogIn,
  CheckCheckIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BsGithub } from "react-icons/bs";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Inicio",
    url: "/",
    icon: LayoutDashboard,
    size: 20,
  },
  {
    title: "Dicas",
    url: "/dicas",
    icon: CheckCheckIcon,
    size: 20,
  },
  {
    title: "Noticias",
    url: "/posts",
    icon: FileText,
    size: 20,
  },
];

export function WebSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname === url || pathname?.startsWith(`${url}/`);
  };

  return (
    <Sidebar collapsible={"icon"} variant={"sidebar"}>
      <SidebarHeader>
        <SidebarGroupLabel className="text-xl mx-5">Sistema</SidebarGroupLabel>
        <SidebarSeparator className="mt-5" />
        <SidebarTrigger className="absolute top-1 right-1 flex items-center gap-2">
          <Menu size={20} /> Fechar
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto flex-grow">
        <SidebarGroup>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-neutral-800/50",
                      isActive(item.url) && "bg-neutral-800 text-white",
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon size={item.size} />
                      <span className="text-[16px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="https://github.com" target="_blank">
                <BsGithub size={20} />
                <span className="text-[16px]">GitHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logoutAction}>
              <LogIn size={20} />
              <span className="text-[16px]">Entrar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
