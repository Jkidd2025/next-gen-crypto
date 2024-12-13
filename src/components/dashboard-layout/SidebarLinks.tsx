import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Repeat,
  Shield,
  Home,
} from "lucide-react";

export const links = [
  { to: "", icon: Home, label: "Overview" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/strategic-reserve", icon: Shield, label: "Strategic Reserve" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/swap", icon: Repeat, label: "Swap" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarLinksProps {
  open: boolean;
  isMobile: boolean;
  onLinkClick?: () => void;
}

export const SidebarLinks = ({ open, isMobile, onLinkClick }: SidebarLinksProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === "/dashboard" + path;
  };

  return (
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
          onClick={onLinkClick}
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
  );
};