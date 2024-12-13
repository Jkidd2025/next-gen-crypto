import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Repeat,
  Shield,
  Home,
  LogOut,
  Menu,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

export const DashboardSidebar = () => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === "/dashboard" + path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Changed from "/login" to "/" to redirect to landing page
  };

  const links = [
    { to: "", icon: Home, label: "Overview" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/strategic-reserve", icon: Shield, label: "Strategic Reserve" },
    { to: "/reports", icon: FileText, label: "Reports" },
    { to: "/swap", icon: Repeat, label: "Swap" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 p-2 bg-background border rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
      
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-screen w-[280px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-all duration-300 ease-in-out",
          isMobile && !open && "-translate-x-full",
          !isMobile && !open && "w-20"
        )}
      >
        <nav className="flex h-full flex-col gap-2 p-4">
          <div className="flex-1 space-y-2">
            {links.map(({ to, icon: Icon, label }) => (
              <Button
                key={to}
                variant={isActive(to) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  !open && !isMobile && "justify-center px-0",
                  "transition-all duration-300"
                )}
                asChild
              >
                <Link to={`/dashboard${to}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className={cn(
                    "ml-2",
                    !open && !isMobile && "hidden",
                    "transition-all duration-300"
                  )}>{label}</span>
                </Link>
              </Button>
            ))}
          </div>
          
          {/* Logout button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start mt-auto",
              !open && !isMobile && "justify-center px-0",
              "transition-all duration-300"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={cn(
              "ml-2",
              !open && !isMobile && "hidden",
              "transition-all duration-300"
            )}>Logout</span>
          </Button>
        </nav>
      </aside>
    </>
  );
};