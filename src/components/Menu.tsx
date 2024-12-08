import { Menu as MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Menu = () => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <MenuIcon className="h-6 w-6 text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Our Story</DropdownMenuItem>
          <DropdownMenuItem>Tokenomics</DropdownMenuItem>
          <DropdownMenuItem>Community</DropdownMenuItem>
          <DropdownMenuItem>Contact Us</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};