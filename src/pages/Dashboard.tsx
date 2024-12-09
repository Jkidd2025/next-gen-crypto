import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@/components/Analytics";
import { Overview } from "@/components/Overview";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const renderContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case "/dashboard":
        return <Overview />;
      case "/dashboard/analytics":
        return <Analytics />;
      case "/dashboard/reports":
        return <div>Reports Content</div>;
      case "/dashboard/settings":
        return <div>Settings Content</div>;
      default:
        return <Overview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 bg-gradient-to-b from-primary/5 to-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-black">
                {location.pathname === "/dashboard" ? "Overview" : 
                 location.pathname.split("/").pop()?.charAt(0).toUpperCase() + 
                 location.pathname.split("/").pop()?.slice(1)}
              </h1>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;