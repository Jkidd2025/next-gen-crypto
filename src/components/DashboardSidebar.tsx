import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Repeat,
  Shield,
  Home,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardSidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === "/dashboard" + path;
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
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        open ? "w-64" : "w-16",
        "transition-all duration-300 ease-in-out",
        isMobile && !open && "w-0 -translate-x-full"
      )}
    >
      <nav className="flex h-full flex-col gap-2 p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <Button
            key={to}
            variant={isActive(to) ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              !open && "justify-center px-0",
              isMobile && !open && "hidden"
            )}
            asChild
          >
            <Link to={`/dashboard${to}`}>
              <Icon className="h-4 w-4" />
              {open && <span className="ml-2">{label}</span>}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
};