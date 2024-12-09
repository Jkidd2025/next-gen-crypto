import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@/components/Analytics";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const data = [
    { time: '00:00', price: 0.002590 },
    { time: '06:00', price: 0.002727 },
    { time: '12:00', price: 0.002463 },
    { time: '18:00', price: 0.002590 },
    { time: '24:00', price: 0.002571 },
  ];

  const transactions = [
    { time: '16s ago', type: 'Buy', amount: '2,452.84', price: '$0.002571' },
    { time: '18s ago', type: 'Buy', amount: '18,419', price: '$0.002571' },
    { time: '20s ago', type: 'Sell', amount: '322,205', price: '$0.002571' },
    { time: '21s ago', type: 'Sell', amount: '3,705.96', price: '$0.002585' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 bg-gradient-to-b from-primary/5 to-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-black">Overview</h1>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            
            <Analytics />

            {/* Price Chart */}
            <Card className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
