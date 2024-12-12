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
    className="flex flex-col items-center justify-center gap-2 cursor-pointer py-3 px-4 text-black dark:text-white hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 text-center"
    onClick={() => onItemClick(id)}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </DropdownMenuItem>
);