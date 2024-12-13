import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarLinks } from "./dashboard-layout/SidebarLinks";
import { LogoutButton } from "./dashboard-layout/LogoutButton";
import { MobileMenuButton } from "./dashboard-layout/MobileMenuButton";
import { MobileOverlay } from "./dashboard-layout/MobileOverlay";

export const DashboardSidebar = () => {
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  const handleClose = () => setOpen(false);

  return (
    <>
      <MobileMenuButton onClick={() => setOpen(!open)} />
      <MobileOverlay show={isMobile && open} onClick={handleClose} />
      
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-[280px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-all duration-300 ease-in-out",
          isMobile && !open && "-translate-x-full",
          !isMobile && !open && "w-20"
        )}
      >
        <nav className="flex h-full flex-col gap-2 p-4">
          <SidebarLinks 
            open={open} 
            isMobile={isMobile} 
            onLinkClick={isMobile ? handleClose : undefined} 
          />
          <LogoutButton 
            open={open} 
            isMobile={isMobile} 
            onLogoutClick={isMobile ? handleClose : undefined} 
          />
        </nav>
      </aside>
    </>
  );
};