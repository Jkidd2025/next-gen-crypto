import { TokenSwap as TokenSwapComponent } from "@/components/TokenSwap";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function TokenSwap() {
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
              <h1 className="text-lg md:text-xl font-semibold">Token Swap</h1>
            </div>
          </div>
          <TokenSwapComponent />
        </main>
      </div>
    </SidebarProvider>
  );
}