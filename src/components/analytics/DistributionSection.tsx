import { Skeleton } from "@/components/ui/skeleton";
import { TokenDistributionTable } from "./TokenDistributionTable";
import { HoldersList } from "./HoldersList";

interface DistributionSectionProps {
  isLoading: boolean;
  tokenDistribution: Array<{
    name: string;
    balance: number;
    percentage: number;
  }>;
  holders: Array<{
    address: string;
    balance: number;
  }>;
}

export const DistributionSection = ({
  isLoading,
  tokenDistribution,
  holders,
}: DistributionSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isLoading ? (
        <>
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </>
      ) : (
        <>
          <TokenDistributionTable distribution={tokenDistribution} />
          <HoldersList holders={holders} />
        </>
      )}
    </div>
  );
};