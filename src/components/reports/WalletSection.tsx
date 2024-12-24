import { useWalletBalance } from "@/hooks/useWalletBalance";
import { BalanceUSDCard } from "./wallet/BalanceUSDCard";
import { BalanceSOLCard } from "./wallet/BalanceSOLCard";
import { PortfolioCard } from "./wallet/PortfolioCard";

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
  const { balance, usdBalance, portfolioValue } = useWalletBalance(isWalletConnected);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BalanceUSDCard
        isWalletConnected={isWalletConnected}
        connectWallet={connectWallet}
        usdBalance={usdBalance}
      />
      <BalanceSOLCard
        isWalletConnected={isWalletConnected}
        balance={balance}
      />
      <PortfolioCard
        isLoadingCounts={isLoadingCounts}
        portfolioValue={portfolioValue}
      />
    </div>
  );
};