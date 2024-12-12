import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  label: string;
  id: string;
  icon: LucideIcon;
  onItemClick: (id: string) => void;
}

export const MenuItem = ({ label, id, icon: Icon, onItemClick }: MenuItemProps) => (
  <DropdownMenuItem 
    className="flex items-center gap-3 cursor-pointer text-xl py-4 px-6 text-black dark:text-white hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300"
    onClick={() => onItemClick(id)}
  >
    <Icon className="w-5 h-5" />
    {label}
  </DropdownMenuItem>
);