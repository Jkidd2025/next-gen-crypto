import { WalletSection } from "./reports/WalletSection";
import { TransactionStats } from "./reports/TransactionStats";
import { RecentTransactions } from "./reports/RecentTransactions";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTransactionData } from "@/hooks/useTransactionData";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, WifiOff } from "lucide-react";

export const Reports = () => {
  const { connected, connect } = useWalletConnection();
  const {
    transactionCounts,
    isLoadingCounts,
    recentTransactions,
    isLoadingTransactions
  } = useTransactionData();
  const { isOnline, connectionQuality } = useNetworkStatus();

  if (!isOnline) {
    return (
      <Alert variant="destructive" className="m-6">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You are currently offline. Please check your internet connection.
        </AlertDescription>
      </Alert>
    );
  }

  if (connectionQuality === 'poor') {
    return (
      <Alert variant="warning" className="m-6">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Your connection is slow. Some features may be affected.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <WalletSection
        isWalletConnected={connected}
        connectWallet={connect}
        isLoadingCounts={isLoadingCounts}
      />
      <TransactionStats
        isLoadingCounts={isLoadingCounts}
        transactionCounts={transactionCounts}
      />
      <RecentTransactions
        isLoadingTransactions={isLoadingTransactions}
        recentTransactions={recentTransactions}
      />
    </div>
  );
};