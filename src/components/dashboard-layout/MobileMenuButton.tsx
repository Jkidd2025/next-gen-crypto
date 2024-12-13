import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-2 bg-background border rounded-lg md:hidden"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
};