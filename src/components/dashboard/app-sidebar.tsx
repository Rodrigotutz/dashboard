"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Session } from "@/interfaces/session";

import logoutAction from "@/utils/auth/logoutAction";
import { getFirstTwoNames } from "@/utils/getFirstTwoNames";

import { getInitials } from "@/utils/getInitials";

import {
  LogOut,
  Settings2,
  Menu,
  ChevronRight,
  Users,
  House,
  BookCheck,
  BusFront,
  CheckCheck,
  LockKeyhole,
  Mail,
  Info,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AiOutlineLoading3Quarters, AiOutlineWhatsApp } from "react-icons/ai";
import { BsCash, BsGear } from "react-icons/bs";

const items = [
  {
    title: "Incio",
    url: "/",
    icon: House,
    size: 20,
  },

  {
    title: "Whatsapp",
    url: "/whatsapp",
    icon: AiOutlineWhatsApp,
    size: 20,
  },

  {
    title: "Prestação",
    url: "/contas",
    icon: BsCash,
    size: 20,
  },

  {
    title: "Viagens",
    url: "/viagens",
    icon: BusFront,
    size: 20,
  },
  {
    title: "Dicas",
    url: "/dicas",
    icon: CheckCheck,
    size: 20,
  },

  {
    title: "Tarefas",
    url: "/tarefas",
    icon: BookCheck,
    size: 20,
  },

  {
    title: "Avisos",
    url: "/info",
    icon: Info,
    size: 20,
  },
];

export function AppSidebar() {
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
    <Sidebar collapsible={"icon"} variant={"sidebar"}>
      <div className="flex flex-col h-full">
        <SidebarHeader className="shrink-0 bg-neutral-900">
          <SidebarGroupLabel className="flex gap-2 mt-2">
            <Avatar>
              <AvatarImage src="user.png" />
              <AvatarFallback className="bg-gray-700 text-white text-2xl font-bold">
                {session ? (
                  getInitials(session?.user?.name)
                ) : (
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg">
                {session
                  ? getFirstTwoNames(session?.user?.name)
                  : "Carregando..."}
              </h3>
              <p>
                {session
                  ? session?.user?.type === "admin"
                    ? "Administrador"
                    : "Usuário"
                  : "Carregando..."}
              </p>
            </div>
          </SidebarGroupLabel>
          <SidebarSeparator className="mt-5" />
          <SidebarTrigger className="absolute top-1 right-1 flex items-center gap-2">
            <Menu /> Fechar Sidebar
          </SidebarTrigger>
        </SidebarHeader>

        <SidebarContent className="overflow-y-auto flex-grow bg-neutral-900">
          <SidebarGroup>
            <SidebarGroupContent className="mt-5">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <SidebarMenuButton asChild>
                      <Link href={`/dashboard${item.url}`}>
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

        <SidebarFooter className="bg-neutral-900 shrink-0">
          {session?.user?.type === "admin" ? (
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Settings2 /> Definições
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <Link href={"/dashboard/definicoes"}>
                          <SidebarMenuButton className="cursor-pointer">
                            <BsGear size={20} /> Geral
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link href={"/dashboard/definicoes/autenticacao"}>
                          <SidebarMenuButton className="cursor-pointer">
                            <LockKeyhole size={20} /> Autenticação
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link href={"/dashboard/definicoes/email"}>
                          <SidebarMenuButton className="cursor-pointer">
                            <Mail size={20} /> Email
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link href={"/dashboard/definicoes/usuarios"}>
                          <SidebarMenuButton className="cursor-pointer">
                            <Users size={20} /> Usuarios
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          ) : null}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logoutAction}>
                <LogOut /> Sair
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
