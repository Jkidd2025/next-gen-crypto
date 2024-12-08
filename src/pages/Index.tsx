import { Hero } from "@/components/Hero";
import { Roadmap } from "@/components/Roadmap";
import { TokenSwap } from "@/components/TokenSwap";
import { PriceTracker } from "@/components/PriceTracker";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Roadmap />
      <TokenSwap />
      <PriceTracker />
    </div>
  );
};

export default Index;