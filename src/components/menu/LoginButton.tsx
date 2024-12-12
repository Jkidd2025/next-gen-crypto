import { LogIn } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface LoginButtonProps {
  onLogin: () => void;
}

export const LoginButton = ({ onLogin }: LoginButtonProps) => (
  <DropdownMenuItem 
    className="flex items-center gap-3 cursor-pointer text-xl py-4 px-6 text-black dark:text-white hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 mt-4"
    onClick={onLogin}
  >
    <LogIn className="w-5 h-5" />
    Login
  </DropdownMenuItem>
);