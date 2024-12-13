import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Overview } from "@/components/Overview";
import { Analytics } from "@/components/Analytics";
import { Reports } from "@/components/Reports";
import { StrategicReserve } from "@/components/StrategicReserve";
import { DashboardCommunity } from "@/components/DashboardCommunity";
import { Settings } from "@/components/Settings";
import { TokenSwap } from "@/components/TokenSwap";
import { Routes, Route } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        
        <main className={cn(
          "flex-1 overflow-y-auto",
          isMobile ? "w-full" : "ml-[280px] w-[calc(100%-280px)]"
        )}>
          <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-14 md:h-16 items-center gap-4 px-3 md:px-6">
              <h1 className="text-lg md:text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
          
          <div className="container mx-auto px-3 md:px-6 py-4 md:py-6">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="community" element={<DashboardCommunity />} />
              <Route path="strategic-reserve" element={<StrategicReserve />} />
              <Route path="reports" element={<Reports />} />
              <Route path="swap" element={<TokenSwap />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;