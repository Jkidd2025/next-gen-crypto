import { LogIn } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface LoginButtonProps {
  onLogin: () => void;
}

export const LoginButton = ({ onLogin }: LoginButtonProps) => (
  <DropdownMenuItem 
    className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 text-black dark:text-white hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 mt-2 w-full"
    onClick={onLogin}
  >
    <LogIn className="w-5 h-5" />
    <span className="text-sm font-medium">Login</span>
  </DropdownMenuItem>
);