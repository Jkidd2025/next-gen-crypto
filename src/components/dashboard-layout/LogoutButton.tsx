import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface LogoutButtonProps {
  open: boolean;
  isMobile: boolean;
  onLogoutClick?: () => void;
}

export const LogoutButton = ({ open, isMobile, onLogoutClick }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    onLogoutClick?.();
  };

  return (
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
  );
};