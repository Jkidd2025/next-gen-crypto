import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users, Activity, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "./Web3Provider";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { useToast } from "@/hooks/use-toast";

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

  const WalletButton = () => (
    <Button 
      onClick={isWalletConnected ? handleDisconnect : handleConnect}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
    </Button>
  );

  return (
    <div className="space-y-6">
      {isWalletConnected && (
        <div className="text-sm text-muted-foreground">
          Connected: <span className="font-mono">{account}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.000001</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180 new holders this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trading Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">
              +7% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Token Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
