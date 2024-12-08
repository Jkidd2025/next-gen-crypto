import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { TokenSwap } from "@/components/TokenSwap";
import { PriceTracker } from "@/components/PriceTracker";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Menu } from "@/components/Menu";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Menu />
      <Hero />
      <OurStory />
      <Tokenomics />
      <Roadmap />
      <SmartContract />
      <TokenSwap />
      <PriceTracker />
    </div>
  );
};

export default Index;