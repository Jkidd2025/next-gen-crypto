import { Menu as MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Menu = () => {
  const menuItems = [
    { label: "Our Story", id: "our-story" },
    { label: "Tokenomics", id: "tokenomics" },
    { label: "Roadmap", id: "roadmap" },
    { label: "Smart Contract", id: "smart-contract" },
    { label: "Community", id: "community" },
    { label: "Contact Us", id: "contact-us" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="md:hidden fixed top-8 right-8 z-50">
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
          className="w-screen h-[calc(100vh-6rem)] mt-4 bg-white/90 backdrop-blur-md border-white/20"
        >
          <div className="flex flex-col gap-8">
            {menuItems.map((item) => (
              <DropdownMenuItem 
                key={item.label} 
                className="cursor-pointer text-xl py-4 text-black hover:text-primary transition-colors"
                onClick={() => {
                  scrollToSection(item.id);
                  document.querySelector('[role="menuitem"]')?.closest('[role="menu"]')?.parentElement?.querySelector('button')?.click();
                }}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};