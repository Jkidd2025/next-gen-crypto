import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';

const WALLET_CONNECTION_TIMEOUT = 30000; // 30 seconds

export const useWalletConnection = () => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for persisted connection
    const persistedConnection = localStorage.getItem('walletConnected');
    if (persistedConnection === 'true' && !connected && !connecting) {
      handleConnect();
    }
  }, []);

  const handleConnect = useCallback(async () => {
    if (connected || isConnecting) return;

    setIsConnecting(true);
    let timeoutId: NodeJS.Timeout;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Connection timeout')), WALLET_CONNECTION_TIMEOUT);
      });

      await Promise.race([
        connect(),
        timeoutPromise
      ]);

      localStorage.setItem('walletConnected', 'true');
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
      
      localStorage.removeItem('walletConnected');
    } finally {
      setIsConnecting(false);
      clearTimeout(timeoutId);
    }
  }, [connect, connected, isConnecting, toast]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      localStorage.removeItem('walletConnected');
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  }, [disconnect, toast]);

  return {
    connected,
    connecting: isConnecting,
    publicKey,
    connect: handleConnect,
    disconnect: handleDisconnect
  };
};