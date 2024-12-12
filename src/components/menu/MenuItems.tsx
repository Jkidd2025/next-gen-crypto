import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface MenuItemProps {
  label: string;
  id: string;
  onItemClick: (id: string) => void;
}

export const MenuItem = ({ label, id, onItemClick }: MenuItemProps) => (
  <DropdownMenuItem 
    className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors"
    onClick={() => onItemClick(id)}
  >
    {label}
  </DropdownMenuItem>
);