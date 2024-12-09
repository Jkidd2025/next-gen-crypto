import { TokenSwap } from "@/components/TokenSwap";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function TokenSwapPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 bg-gradient-to-b from-primary/5 to-background">
          <TokenSwap />
        </main>
      </div>
    </SidebarProvider>
  );
}