import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { Menu } from "@/components/Menu";
import { PriceTracker } from "@/components/PriceTracker";
import { LearnSection } from "@/components/LearnSection";
import { SecurityFeatures } from "@/components/SecurityFeatures";
import { NetworkStats } from "@/components/NetworkStats";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Menu />
      <Hero />
      <PriceTracker />
      <NetworkStats />
      <OurStory />
      <Community />
      <SecurityFeatures />
      <Tokenomics />
      <Roadmap />
      <SmartContract />
      <LearnSection />
      <ContactUs />
    </div>
  );
};

export default Index;