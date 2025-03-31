import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider defaultOpen={true} className="bg-neutral-900 relative">
      <aside>
        <SidebarTrigger className="absolute md:hidden top-0 left-0 z-50 text-white">
          <Menu size={24} />
        </SidebarTrigger>
        <AppSidebar />
      </aside>
      <main className="w-full rounded-lg md:m-3 md:ml-1 p-5 text-white bg-neutral-950">
        {children}
      </main>
    </SidebarProvider>
  );
}
