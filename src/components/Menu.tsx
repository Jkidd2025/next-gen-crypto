import { Menu as MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Menu = () => {
  return (
    <div className="fixed top-4 left-4 md:top-8 md:left-8 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <MenuIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="cursor-pointer text-lg py-3">Our Story</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-lg py-3">Tokenomics</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-lg py-3">Community</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-lg py-3">Contact Us</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};