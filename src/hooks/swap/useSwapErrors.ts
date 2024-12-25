import { SwapError } from '@/types/token-swap';
import { supabase } from "@/integrations/supabase/client";

export const logSwapError = async (error: Error, context: Record<string, any>) => {
  console.error('Swap error:', error, context);
  
  // Log error to Supabase
  await supabase.from('swap_metrics').insert({
    success: false,
    error: error.message,
    from_token: context.tokenIn?.symbol || null,
    to_token: context.tokenOut?.symbol || null,
    amount: context.amountIn ? parseFloat(context.amountIn) : null,
  });
};

export const createSwapError = (code: string, message: string): SwapError => ({
  code,
  message,
});