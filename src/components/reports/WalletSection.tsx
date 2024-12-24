import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Coins, LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

interface WalletSectionProps {
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  isLoadingCounts: boolean;
}

export const WalletSection = ({
  isWalletConnected,
  connectWallet,
  isLoadingCounts
}: WalletSectionProps) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  // Fetch SOL price
  const { data: solPrice } = useQuery({
    queryKey: ['sol-price'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      return data.solana.usd;
    },
    enabled: isWalletConnected,
  });

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(0);
        }
      }
    };

    fetchBalance();
    // Set up balance change listener
    if (publicKey) {
      const subscriptionId = connection.onAccountChange(
        publicKey,
        (updatedAccountInfo) => {
          setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
        }
      );

      return () => {
        connection.removeAccountChangeListener(subscriptionId);
      };
    }
  }, [publicKey, connection]);

  const usdBalance = (balance * (solPrice || 0));
  const portfolioValue = usdBalance + 1000; // Add other token values here

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance in USD</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletConnected ? (
              `$${usdBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            ) : (
              <Button 
                onClick={connectWallet}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance in SOL</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletConnected ? (
              `${balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL`
            ) : (
              <div className="text-gray-500">Connect wallet to view balance</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingCounts ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-2xl font-bold">
              ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};