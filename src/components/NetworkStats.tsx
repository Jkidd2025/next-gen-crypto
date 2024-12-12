import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NetworkStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['network-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Network Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Holders</p>
                <p className="text-3xl font-bold mt-2">{stats?.total_holders?.toLocaleString() || '0'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Market Value</p>
                <p className="text-3xl font-bold mt-2">${stats?.market_value?.toLocaleString() || '0'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">24h Transactions</p>
                <p className="text-3xl font-bold mt-2">{stats?.transaction_count?.toLocaleString() || '0'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-3xl font-bold mt-2">${stats?.transaction_volume?.toLocaleString() || '0'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};