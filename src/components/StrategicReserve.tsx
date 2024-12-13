import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export const StrategicReserve = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState<string>("Loading...");
  const [reserveValue, setReserveValue] = useState<string>("Calculating...");
  const TOTAL_RESERVE = 1000000; // 1 million Bitcoin

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const price = data.bitcoin.usd;
        
        // Format the individual Bitcoin price
        const formattedPrice = price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        setBitcoinPrice(formattedPrice);

        // Calculate and format the total reserve value
        const totalValue = price * TOTAL_RESERVE;
        const formattedValue = totalValue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        setReserveValue(formattedValue);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        setBitcoinPrice('Error loading price');
        setReserveValue('Error calculating value');
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
          <CardTitle>Strategic Reserve Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{reserveValue}</p>
          <p className="text-sm text-muted-foreground">Total Value in USD</p>
        </CardContent>
      </Card>
    </div>
  );
};