import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Transaction {
  id: string;
  from_token: string;
  to_token: string;
  from_amount: number;
  to_amount: number;
  status: string;
  created_at: string;
  gas_fee: number;
}

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("swap_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransactions(data);
      }
    };

    fetchTransactions();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel("swap_transactions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "swap_transactions",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [payload.new as Transaction, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.from_token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to_token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div>
              <p className="text-sm font-medium">
                {tx.from_amount} {tx.from_token} → {tx.to_amount} {tx.to_token}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Gas: {tx.gas_fee} SOL</p>
              <p
                className={`text-xs ${
                  tx.status === "completed"
                    ? "text-green-500"
                    : tx.status === "failed"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};