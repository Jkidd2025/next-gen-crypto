import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Key, AlertTriangle } from "lucide-react";

export const SecurityFeatures = () => {
  const features = [
    {
      title: "Secure Infrastructure",
      description: "Enterprise-grade security measures to protect your assets",
      icon: Shield,
    },
    {
      title: "Multi-Factor Authentication",
      description: "Additional layers of security for your account",
      icon: Lock,
    },
    {
      title: "Hardware Wallet Support",
      description: "Compatible with leading hardware wallets",
      icon: Key,
    },
    {
      title: "Risk Management",
      description: "Advanced tools to help you trade safely",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="py-20 bg-white" id="security">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Security First</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-none bg-transparent">
              <CardContent className="text-center p-6">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};