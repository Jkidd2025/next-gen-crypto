import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { Menu } from "@/components/Menu";
import { LearnSection } from "@/components/LearnSection";
import { TokenSwap } from "@/components/TokenSwap";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Menu />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <OurStory />
        <TokenSwap />
        <Community />
        <Tokenomics />
        <Roadmap />
        <SmartContract />
        <LearnSection />
        <ContactUs />
      </main>
    </div>
  );
};

export default Index;