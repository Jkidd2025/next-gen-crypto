import { Menu as MenuIcon, BookOpen, Coins, Route, FileCode, GraduationCap, Users, Mail, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
    { label: "Our Story", id: "our-story", icon: BookOpen },
    { label: "Tokenomics", id: "tokenomics", icon: Coins },
    { label: "Roadmap", id: "roadmap", icon: Route },
    { label: "Smart Contract", id: "smart-contract", icon: FileCode },
    { label: "Learn", id: "learn", icon: GraduationCap },
    { label: "Community", id: "community", icon: Users },
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
      <Link
        to="/login"
        className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
      >
        <LogIn className="w-4 h-4" />
        <span>Login</span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-6 h-6 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[360px] mt-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 animate-in slide-in-from-top-2 duration-300"
        >
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  label={item.label}
                  id={item.id}
                  icon={item.icon}
                  onItemClick={scrollToSection}
                />
              ))}
            </div>
            <div className="space-y-2">
              <MenuItem
                label="Contact Us"
                id="contact-us"
                icon={Mail}
                onItemClick={scrollToSection}
              />
              <LoginButton onLogin={handleLogin} />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};