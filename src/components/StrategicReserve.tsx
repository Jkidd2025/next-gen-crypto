import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export const StrategicReserve = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState<string>("Loading...");

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const price = data.bitcoin.usd.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        setBitcoinPrice(price);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        setBitcoinPrice('Error loading price');
      }
    };

    fetchBitcoinPrice();
    // Refresh price every minute
    const interval = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Reserve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">1,000,000 BITCOIN</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bitcoin Market Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{bitcoinPrice}</p>
          <p className="text-sm text-muted-foreground">Current Market Price</p>
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