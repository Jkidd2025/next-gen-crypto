import { TokenSwap } from "@/components/TokenSwap";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function TokenSwapPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <TokenSwap />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}