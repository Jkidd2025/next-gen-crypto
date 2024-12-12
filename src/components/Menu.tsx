import { Menu as MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItem } from "./menu/MenuItems";
import { LoginButton } from "./menu/LoginButton";

export const Menu = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: "Our Story", id: "our-story" },
    { label: "Tokenomics", id: "tokenomics" },
    { label: "Roadmap", id: "roadmap" },
    { label: "Smart Contract", id: "smart-contract" },
    { label: "Learn", id: "learn" },
    { label: "Community", id: "community" },
    { label: "Contact Us", id: "contact-us" }
  ];

  const closeMenu = () => {
    const menuTrigger = document.querySelector('[aria-label="Toggle menu"]') as HTMLButtonElement;
    if (menuTrigger) {
      menuTrigger.click();
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    }
  };

  const handleLogin = () => {
    navigate("/login");
    closeMenu();
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
              <MenuItem
                key={item.label}
                label={item.label}
                id={item.id}
                onItemClick={scrollToSection}
              />
            ))}
            <LoginButton onLogin={handleLogin} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};