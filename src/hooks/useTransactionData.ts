import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface TransactionCounts {
  total: number;
  buys: number;
  sells: number;
}

export interface Transaction {
  hash: string;
  type: string;
  amount: number;
  timestamp: string;
}

export const useTransactionData = () => {
  const { toast } = useToast();

  const { data: transactionCounts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ['transaction-counts'],
    queryFn: async () => {
      const { data: totalData, error: totalError } = await supabase
        .from('swap_transactions')
        .select('id');

      if (totalError) {
        toast({
          title: "Error loading total transactions",
          description: totalError.message,
          variant: "destructive"
        });
        return {
          total: 0,
          buys: 0,
          sells: 0
        };
      }

      const { data: buyData, error: buyError } = await supabase
        .from('swap_transactions')
        .select('id')
        .eq('type', 'buy');

      if (buyError) {
        toast({
          title: "Error loading buy transactions",
          description: buyError.message,
          variant: "destructive"
        });
        return {
          total: totalData.length,
          buys: 0,
          sells: 0
        };
      }

      const { data: sellData, error: sellError } = await supabase
        .from('swap_transactions')
        .select('id')
        .eq('type', 'sell');

      if (sellError) {
        toast({
          title: "Error loading sell transactions",
          description: sellError.message,
          variant: "destructive"
        });
        return {
          total: totalData.length,
          buys: buyData.length,
          sells: 0
        };
      }

      return {
        total: totalData.length,
        buys: buyData.length,
        sells: sellData.length
      };
    }
  });

  const { data: recentTransactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('swap_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        toast({
          title: "Error loading transactions",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      return data.map(tx => ({
        hash: tx.id,
        type: tx.from_token.includes('SOL') ? 'Sell' : 'Buy',
        amount: tx.from_amount,
        timestamp: tx.created_at
      }));
    }
  });

  return {
    transactionCounts,
    isLoadingCounts,
    recentTransactions,
    isLoadingTransactions
  };
};