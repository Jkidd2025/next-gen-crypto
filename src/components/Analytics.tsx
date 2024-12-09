import { useEffect, useState } from "react";
import { WalletStats } from "./analytics/WalletStats";
import { TokenDistributionTable } from "./analytics/TokenDistributionTable";
import { TransactionsTable } from "./analytics/TransactionsTable";
import { HoldersList } from "./analytics/HoldersList";

interface WalletStats {
  totalHolders: number;
  marketValue: number;
  balance: number;
  solPrice: number;
  transactionCount: number;
  transactionVolume: number;
}

interface TokenDistribution {
  name: string;
  balance: number;
  percentage: number;
}

interface Transaction {
  hash: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface Holder {
  address: string;
  balance: number;
}

export const Analytics = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    totalHolders: 0,
    marketValue: 0,
    balance: 0,
    solPrice: 0,
    transactionCount: 0,
    transactionVolume: 0
  });

  const [holders, setHolders] = useState<Holder[]>([
    { address: "8xk7...", balance: 1000000 },
    { address: "9js2...", balance: 750000 },
    { address: "3kl9...", balance: 500000 },
    { address: "5mn4...", balance: 250000 },
  ]);

  const tokenDistribution: TokenDistribution[] = [
    { name: "Community Rewards", balance: 150000000, percentage: 15 },
    { name: "Liquidity Pool", balance: 300000000, percentage: 30 },
    { name: "Marketing", balance: 50000000, percentage: 5 },
    { name: "Public Sale", balance: 400000000, percentage: 40 },
    { name: "Team/Development", balance: 100000000, percentage: 10 }
  ];

  const recentTransactions: Transaction[] = [
    {
      hash: "HXk9...",
      type: "Transfer",
      amount: 1000,
      timestamp: "2024-03-09 12:30"
    },
    {
      hash: "7Ypq...",
      type: "Swap",
      amount: 500,
      timestamp: "2024-03-09 12:25"
    }
  ];

  const connectWallet = async () => {
    try {
      setIsWalletConnected(true);
      console.log("Wallet connected");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className="space-y-6">
      <WalletStats
        {...walletStats}
        isWalletConnected={isWalletConnected}
        onConnectWallet={connectWallet}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TokenDistributionTable distribution={tokenDistribution} />
        <HoldersList holders={holders} />
      </div>
      
      <TransactionsTable transactions={recentTransactions} />
    </div>
  );
};