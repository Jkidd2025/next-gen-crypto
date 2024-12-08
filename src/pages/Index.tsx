import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
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
    </div>
  );
};

export default Index;