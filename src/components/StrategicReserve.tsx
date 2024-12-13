import { useState, useEffect } from "react";
import { TransactionsTable } from "@/components/analytics/TransactionsTable";
import { supabase } from "@/integrations/supabase/client";
import { ReserveCard } from "./strategic-reserve/ReserveCard";

export const StrategicReserve = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState<string>("Loading...");
  const [reserveValue, setReserveValue] = useState<string>("Calculating...");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const TOTAL_RESERVE = 1000000; // 1 million Bitcoin

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const price = data.bitcoin.usd;
        
        // Format the individual Bitcoin price
        const formattedPrice = price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        setBitcoinPrice(formattedPrice);

        // Calculate and format the total reserve value
        const totalValue = price * TOTAL_RESERVE;
        const formattedValue = totalValue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        setReserveValue(formattedValue);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        setBitcoinPrice('Error loading price');
        setReserveValue('Error calculating value');
      }
    };

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('strategic_reserve_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      const formattedTransactions = data.map(tx => ({
        hash: tx.transaction_hash,
        type: 'buy',
        amount: tx.amount,
        timestamp: tx.transaction_date
      }));

      setTransactions(formattedTransactions);
      setIsLoading(false);
    };

    fetchBitcoinPrice();
    fetchTransactions();

    // Refresh price every minute
    const interval = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReserveCard
          title="Total Reserve"
          tooltipContent="The total amount of Bitcoin held in the strategic reserve"
          value={`${TOTAL_RESERVE.toLocaleString()} BTC`}
          isLoading={isLoading}
        />

        <ReserveCard
          title="Bitcoin Market Value"
          tooltipContent="Current market price of Bitcoin, updated every minute"
          value={bitcoinPrice}
          subtitle="Current Market Price"
          isLoading={isLoading}
        />

        <ReserveCard
          title="Strategic Reserve Value"
          tooltipContent="Total value of the strategic reserve in USD based on current Bitcoin price"
          value={reserveValue}
          subtitle="Total Value in USD"
          isLoading={isLoading}
        />
      </div>

      <TransactionsTable transactions={transactions} isLoading={isLoading} />
    </div>
  );
};