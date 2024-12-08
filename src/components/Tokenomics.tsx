import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Tokenomics = () => {
  const distributionData = [
    { name: "Public Sale/Launch", value: 40, color: "#8B5CF6" },
    { name: "Liquidity Pool", value: 30, color: "#D946EF" },
    { name: "Community Rewards", value: 15, color: "#F97316" },
    { name: "Team & Development", value: 10, color: "#10B981" },
    { name: "Marketing", value: 5, color: "#3B82F6" },
  ];

  const taxData = [
    { name: "Liquidity Pool", value: 70, color: "#D946EF" },
    { name: "Marketing Wallet", value: 30, color: "#3B82F6" },
  ];

  return (
    <section id="tokenomics" className="py-24 px-4 md:px-8 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Tokenomics</h2>
          <p className="text-xl text-gray-600">Total Supply: 1,000,000,000 (1 Billion) tokens</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 w-full md:w-1/2">
                {distributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}: {item.value}% ({(item.value * 10).toLocaleString()}M tokens)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Tax (3%)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taxData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {taxData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 w-full md:w-1/2">
                {taxData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Anti-Whale Measures</span>
              <span className="text-6xl">🐋</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Max Wallet:</span>
              <span>20,000,000 tokens (2% of total supply)</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <span className="font-semibold">Max Transaction:</span>
              <span>5,000,000 tokens (0.5% of total supply)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};