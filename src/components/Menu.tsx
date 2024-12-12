import { Menu as MenuIcon, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "./Web3Provider";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Menu = () => {
  const navigate = useNavigate();
  const { account, connect: connectWeb3, disconnect: disconnectWeb3 } = useWeb3();
  const { isWalletConnected: isPhantomConnected, handleConnectWallet: connectPhantom } = usePhantomWallet();
  const { toast } = useToast();
  
  const menuItems = [
    { label: "Our Story", id: "our-story" },
    { label: "Tokenomics", id: "tokenomics" },
    { label: "Roadmap", id: "roadmap" },
    { label: "Smart Contract", id: "smart-contract" },
    { label: "Community", id: "community" },
    { label: "Contact Us", id: "contact-us" }
  ];

  const handleConnect = async () => {
    try {
      // Try Web3 wallet first (MetaMask)
      await connectWeb3();
    } catch (error) {
      // If Web3 fails, try Phantom
      try {
        await connectPhantom();
      } catch (phantomError) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectWeb3();
    // Phantom wallet disconnection is handled automatically through its event listener
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isWalletConnected = account || isPhantomConnected;

  return (
    <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
      {!isWalletConnected ? (
        <button
          onClick={handleConnect}
          className="hidden md:flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleDisconnect}
          className="hidden md:flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Disconnect Wallet
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-6 h-6 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-screen h-[calc(100vh-6rem)] mt-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20"
        >
          <div className="flex flex-col gap-8">
            {menuItems.map((item) => (
              <DropdownMenuItem 
                key={item.label} 
                className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors"
                onClick={() => {
                  scrollToSection(item.id);
                  document.querySelector('[role="menuitem"]')?.closest('[role="menu"]')?.parentElement?.querySelector('button')?.click();
                }}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem 
              className="cursor-pointer text-xl py-4 text-black dark:text-white hover:text-primary transition-colors"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};