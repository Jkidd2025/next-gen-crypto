import { toast } from "@/hooks/use-toast";

export const checkWalletAvailability = () => {
  const { ethereum } = window;
  if (!ethereum) {
    console.log("MetaMask not found!");
    return false;
  }
  console.log("MetaMask is available");
  return true;
};

export const handleWalletError = (error: any) => {
  console.error('Wallet error:', error);
  if (error.code === 4001) {
    toast({
      title: "Connection Rejected",
      description: "You rejected the connection request.",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Connection Failed",
      description: "Failed to connect to MetaMask. Please try again.",
      variant: "destructive",
    });
  }
};

export const formatWalletAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};