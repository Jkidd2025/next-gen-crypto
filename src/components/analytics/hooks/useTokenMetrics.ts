import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TimeFrame = "24h" | "7d" | "30d";

const fetchTokenMetrics = async (timeframe: TimeFrame) => {
  const { data, error } = await supabase
    .from("token_metrics")
    .select("*")
    .eq("timeframe", timeframe)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data;
};

export const useTokenMetrics = (timeframe: TimeFrame) => {
  return useQuery({
    queryKey: ["tokenMetrics", timeframe],
    queryFn: () => fetchTokenMetrics(timeframe),
  });
};