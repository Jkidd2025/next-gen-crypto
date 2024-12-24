import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface RouteVisualizerProps {
  route: {
    marketInfos: {
      amm: {
        label: string;
      };
      inputMint: string;
      outputMint: string;
    }[];
  };
  tokenMap: Record<string, { symbol: string; logoURI?: string }>;
}

export const RouteVisualizer = ({ route, tokenMap }: RouteVisualizerProps) => {
  if (!route?.marketInfos?.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-medium mb-2">Swap Route</div>
        <div className="flex items-center gap-2 flex-wrap">
          {route.marketInfos.map((market, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center gap-1">
                <img
                  src={tokenMap[market.inputMint]?.logoURI}
                  alt={tokenMap[market.inputMint]?.symbol}
                  className="w-5 h-5 rounded-full"
                />
                <span>{tokenMap[market.inputMint]?.symbol}</span>
              </div>
              <div className="flex items-center gap-1 mx-2">
                <ArrowRight className="w-4 h-4" />
                <span className="text-xs text-muted-foreground">
                  {market.amm.label}
                </span>
              </div>
              {index === route.marketInfos.length - 1 && (
                <div className="flex items-center gap-1">
                  <img
                    src={tokenMap[market.outputMint]?.logoURI}
                    alt={tokenMap[market.outputMint]?.symbol}
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{tokenMap[market.outputMint]?.symbol}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};