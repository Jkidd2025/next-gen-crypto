import { useState } from "react";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { ErrorBoundary } from "./ErrorBoundary";
import { ConnectionHandler } from "./swap/ConnectionHandler";
import { SwapInterface } from "./swap/SwapInterface";
import { WalletConnect } from "./swap/WalletConnect";
import { useToast } from "@/hooks/use-toast";

const ConnectionErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="container mx-auto px-4 py-8">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
    <div className="mt-4 flex justify-center">
      <Button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Retry Connection
      </Button>
    </div>
  </div>
);

export const TokenSwap = () => {
  const { connected, connecting, publicKey } = useWallet();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleConnectionEstablished = (conn: Connection) => {
    setConnection(conn);
    setIsLoading(false);
  };

  const handleConnectionError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    toast({
      title: "Connection Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleRetryConnection = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleWalletConnect = (isConnected: boolean) => {
    if (isConnected) {
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to wallet",
      });
    }
  };

  if (!publicKey && !connecting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WalletConnect onConnect={handleWalletConnect} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleRetryConnection}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ConnectionErrorFallback}>
      <ConnectionHandler
        onConnectionEstablished={handleConnectionEstablished}
        onError={handleConnectionError}
        isLoading={isLoading}
        connecting={connecting}
      />
      {connection && !isLoading && (
        <SwapInterface
          connected={connected}
          onWalletConnect={handleWalletConnect}
        />
      )}
    </ErrorBoundary>
  );
};