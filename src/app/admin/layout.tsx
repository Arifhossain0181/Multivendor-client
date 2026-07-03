import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import AdminSidebar from "../dashboard/admin/comPonets/adminsidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex min-h-svh flex-1 flex-col bg-background">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SidebarTrigger />
        </div>
        <div className="flex-1 p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
