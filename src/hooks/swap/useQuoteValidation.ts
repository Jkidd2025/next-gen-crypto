import { QuoteResponse } from '@/utils/swap/jupiterApi';
import { SwapError, SwapErrorTypes } from '@/types/errors';

export const useQuoteValidation = () => {
  const validateQuoteResponse = (quote: QuoteResponse) => {
    if (!quote.data) {
      throw new SwapError(
        SwapErrorTypes.API_ERROR,
        'Invalid quote response: missing data',
        'API_ERROR'
      );
    }
    if (!quote.data.outAmount || quote.data.outAmount === '0') {
      throw new SwapError(
        SwapErrorTypes.API_ERROR,
        'Invalid quote response: invalid output amount',
        'API_ERROR'
      );
    }
    if (!quote.data.marketInfos || quote.data.marketInfos.length === 0) {
      throw new SwapError(
        SwapErrorTypes.API_ERROR,
        'Invalid quote response: missing market info',
        'API_ERROR'
      );
    }

    if (quote.data.priceImpactPct > 5) {
      throw new SwapError(
        SwapErrorTypes.PRICE_IMPACT_HIGH,
        `Price impact is too high: ${quote.data.priceImpactPct.toFixed(2)}%`,
        'PRICE_IMPACT_HIGH'
      );
    }
  };

  return { validateQuoteResponse };
};