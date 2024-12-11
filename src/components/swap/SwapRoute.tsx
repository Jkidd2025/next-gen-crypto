import { ArrowDown } from "lucide-react";

interface SwapRouteProps {
  fromToken: string;
  toToken: string;
  route: any[];
}

export const SwapRoute = ({ fromToken, toToken, route }: SwapRouteProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Swap Route:</p>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-primary/10 rounded">{fromToken}</span>
        {route.length > 0 ? (
          route.map((step, index) => (
            <div key={index} className="flex items-center">
              <ArrowDown className="h-4 w-4 mx-2" />
              <span className="px-2 py-1 bg-primary/10 rounded">
                {step.token}
              </span>
            </div>
          ))
        ) : (
          <ArrowDown className="h-4 w-4 mx-2" />
        )}
        <span className="px-2 py-1 bg-primary/10 rounded">{toToken}</span>
      </div>
    </div>
  );
};