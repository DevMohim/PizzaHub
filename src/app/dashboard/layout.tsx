import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import BackToDashboard from "@/components/dashboard/BackToDashboard";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      {/* Full-width content area — children always fill the remaining space */}
      <SidebarInset className="min-w-0">
        {/* <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <SidebarTrigger />
        </div> */}

        <BackToDashboard />
        <div className="w-full flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
