import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@/components/Analytics";
import { Overview } from "@/components/Overview";
import { DashboardCommunity } from "@/components/DashboardCommunity";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";
import { TokenSwap } from "@/components/TokenSwap";
import { StrategicReserve } from "@/components/StrategicReserve";
import { useAuth } from "@/components/AuthProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { supabase } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/dashboard/")[1] || "";
    if (!path) return "Overview";
    
    // Special case for strategic reserve to ensure proper capitalization
    if (path === "strategic-reserve") return "Strategic Reserve";
    
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 bg-gradient-to-b from-primary/5 to-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-black">
                {getPageTitle()}
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="community" element={<DashboardCommunity />} />
              <Route path="strategic-reserve" element={<StrategicReserve />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="swap" element={<TokenSwap />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;