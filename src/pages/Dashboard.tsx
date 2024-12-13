import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Overview } from "@/components/Overview";
import { Analytics } from "@/components/Analytics";
import { Reports } from "@/components/Reports";
import { StrategicReserve } from "@/components/StrategicReserve";
import { DashboardCommunity } from "@/components/DashboardCommunity";
import { Settings } from "@/components/Settings";
import { Routes, Route } from "react-router-dom";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 w-full transition-all duration-300">
          <div className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-16 items-center gap-4 px-4 md:px-6">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
          
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="community" element={<DashboardCommunity />} />
              <Route path="strategic-reserve" element={<StrategicReserve />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;