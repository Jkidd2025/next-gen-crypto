import { LogIn } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface LoginButtonProps {
  onLogin: () => void;
}

export const LoginButton = ({ onLogin }: LoginButtonProps) => (
  <DropdownMenuItem 
    className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors"
    onClick={onLogin}
  >
    <LogIn className="mr-2 h-5 w-5" />
    Login
  </DropdownMenuItem>
);