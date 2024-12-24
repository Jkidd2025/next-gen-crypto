import { useEffect, useCallback } from "react";
import { Connection } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";
import { ConnectionProvider } from "@/utils/solana/ConnectionProvider";
import { Loader2 } from "lucide-react";

interface ConnectionHandlerProps {
  onConnectionEstablished: (connection: Connection) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  connecting?: boolean;
}

export const ConnectionHandler = ({
  onConnectionEstablished,
  onError,
  isLoading,
  connecting,
}: ConnectionHandlerProps) => {
  const { toast } = useToast();

  const initializeConnection = useCallback(async () => {
    try {
      const conn = await ConnectionProvider.getReliableConnection();
      onConnectionEstablished(conn);
      toast({
        title: "Connected",
        description: "Successfully connected to Solana network",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Solana';
      onError(errorMessage);
      console.error('Connection error:', err);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [onConnectionEstablished, onError, toast]);

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  if (isLoading || connecting) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {connecting ? "Connecting wallet..." : "Connecting to Solana network..."}
          </p>
        </div>
      </div>
    );
  }

  return null;
};