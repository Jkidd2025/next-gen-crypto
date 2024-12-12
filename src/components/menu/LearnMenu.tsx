import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface LearnItem {
  label: string;
  path: string;
}

interface LearnMenuProps {
  items: LearnItem[];
  onItemClick: (path: string) => void;
}

export const LearnMenu = ({ items, onItemClick }: LearnMenuProps) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors">
        <BookOpen className="mr-2 h-5 w-5" />
        Learn
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className="cursor-pointer text-lg py-3 text-black dark:text-white hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onItemClick(item.path);
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};