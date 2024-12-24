import { WalletSection } from "./reports/WalletSection";
import { TransactionStats } from "./reports/TransactionStats";
import { RecentTransactions } from "./reports/RecentTransactions";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTransactionData } from "@/hooks/useTransactionData";

export const Reports = () => {
  const { connected, connect } = useWalletConnection();
  const {
    transactionCounts,
    isLoadingCounts,
    recentTransactions,
    isLoadingTransactions
  } = useTransactionData();

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