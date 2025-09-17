import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
    </SidebarProvider>
  );
}
