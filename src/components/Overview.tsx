import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { useWeb3 } from "./Web3Provider";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "./dashboard/StatsCard";
import { TokenPriceChart } from "./dashboard/TokenPriceChart";
import { WalletStatus } from "./dashboard/WalletStatus";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export const Overview = () => {
  const { account, connect: connectWeb3, disconnect: disconnectWeb3 } = useWeb3();
  const { isWalletConnected: isPhantomConnected, handleConnectWallet: connectPhantom } = usePhantomWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connectWeb3();
    } catch (error) {
      try {
        await connectPhantom();
      } catch (phantomError) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectWeb3();
  };

  const isWalletConnected = account || isPhantomConnected;

  const stats = [
    {
      title: "Market Cap",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Token Price",
      value: "$0.000001",
      description: "+10.5% from last week",
      icon: TrendingUp,
    },
    {
      title: "Total Holders",
      value: "2,350",
      description: "+180 new holders this week",
      icon: Users,
    },
    {
      title: "Trading Volume",
      value: "$12,234",
      description: "+7% from yesterday",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <WalletStatus
        isConnected={isWalletConnected}
        account={account}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <TokenPriceChart data={data} />
    </div>
  );
};