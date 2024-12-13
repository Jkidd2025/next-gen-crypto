import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StrategicReserve = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Reserve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">1,000,000 TOKENS</p>
          <p className="text-sm text-muted-foreground">10% of Total Supply</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locked Until</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Dec 31, 2024</p>
          <p className="text-sm text-muted-foreground">180 Days Remaining</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vesting Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">25% Quarterly</p>
          <p className="text-sm text-muted-foreground">Next Release: Q1 2025</p>
        </CardContent>
      </Card>
    </div>
  );
};