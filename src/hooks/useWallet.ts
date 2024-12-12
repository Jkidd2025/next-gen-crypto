import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Found an authorized account:", accounts[0]);
      } else {
        console.log("No authorized account found");
        setAccount(null);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setAccount(null);
    }
  }, []);

  const connect = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
        return;
      }

      setIsConnecting(true);
      
      try {
        const accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast({
            title: "Wallet Connected",
            description: `Connected with address: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        }
      } catch (error: any) {
        // Handle user rejection or other MetaMask errors
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
        setAccount(null);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setAccount(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        console.log('Account changed:', accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast({
            title: "Account Changed",
            description: `Connected to: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        } else {
          setAccount(null);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
          });
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('disconnect', () => {
        setAccount(null);
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, [checkIfWalletIsConnected]);

  return {
    account,
    isConnecting,
    connect,
    disconnect,
  };
};