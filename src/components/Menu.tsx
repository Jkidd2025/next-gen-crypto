import { Menu as MenuIcon, LogIn, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Menu = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: "Our Story", id: "our-story" },
    { label: "Tokenomics", id: "tokenomics" },
    { label: "Roadmap", id: "roadmap" },
    { label: "Smart Contract", id: "smart-contract" },
    { label: "Community", id: "community" },
    { label: "Contact Us", id: "contact-us" }
  ];

  const learnItems = [
    { label: "Getting Started", path: "/getting-started" },
    { label: "Security Best Practices", path: "/security-best-practices" },
    { label: "Wallet Management", path: "/wallet-management" },
    { label: "Trading Basics", path: "/trading-basics" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLearnItemClick = (path: string) => {
    navigate(path);
    // Find and click the menu trigger button to close the dropdown
    const menuTrigger = document.querySelector('[aria-label="Toggle menu"]') as HTMLButtonElement;
    if (menuTrigger) {
      menuTrigger.click();
    }
  };

  return (
    <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
      <button
        onClick={() => navigate("/login")}
        className="hidden md:flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Login
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-6 h-6 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-screen h-[calc(100vh-6rem)] mt-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20"
        >
          <div className="flex flex-col gap-8">
            {menuItems.map((item) => (
              <DropdownMenuItem 
                key={item.label} 
                className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors"
                onClick={() => {
                  scrollToSection(item.id);
                  const menuTrigger = document.querySelector('[aria-label="Toggle menu"]') as HTMLButtonElement;
                  if (menuTrigger) {
                    menuTrigger.click();
                  }
                }}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                {learnItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    className="cursor-pointer text-lg py-3 text-black dark:text-white hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLearnItemClick(item.path);
                    }}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem 
              className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors"
              onClick={() => {
                navigate("/login");
                const menuTrigger = document.querySelector('[aria-label="Toggle menu"]') as HTMLButtonElement;
                if (menuTrigger) {
                  menuTrigger.click();
                }
              }}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};