import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shield, Wallet, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

export const LearnSection = () => {
  const guides = [
    {
      title: "Getting Started",
      description: "Learn the basics of cryptocurrency and how to get started safely.",
      icon: BookOpen,
      link: "/getting-started"
    },
    {
      title: "Security Best Practices",
      description: "Protect your assets with our comprehensive security guide.",
      icon: Shield,
      link: "#"
    },
    {
      title: "Wallet Management",
      description: "Learn how to manage your digital wallet effectively.",
      icon: Wallet,
      link: "#"
    },
    {
      title: "Trading Basics",
      description: "Understanding the fundamentals of token trading.",
      icon: ArrowUpDown,
      link: "#"
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-background to-primary/5" id="learn">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <Link key={index} to={guide.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <guide.icon className="h-8 w-8 mb-4 text-primary" />
                  <CardTitle>{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{guide.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};