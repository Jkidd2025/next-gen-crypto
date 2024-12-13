import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { TransactionsTable } from "@/components/analytics/TransactionsTable";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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

      // Transform the data to match the TransactionsTable component format
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

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Reserve</CardTitle>
            <InfoTooltip content="The total amount of Bitcoin held in the strategic reserve" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold">
                {TOTAL_RESERVE.toLocaleString()} BTC
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bitcoin Market Value</CardTitle>
            <InfoTooltip content="Current market price of Bitcoin, updated every minute" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold">{bitcoinPrice}</p>
                <p className="text-sm text-muted-foreground">Current Market Price</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Strategic Reserve Value</CardTitle>
            <InfoTooltip content="Total value of the strategic reserve in USD based on current Bitcoin price" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold">{reserveValue}</p>
                <p className="text-sm text-muted-foreground">Total Value in USD</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionsTable transactions={transactions} isLoading={isLoading} />
    </div>
  );
};