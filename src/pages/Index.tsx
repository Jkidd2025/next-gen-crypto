import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { Menu } from "@/components/Menu";
import { LearnSection } from "@/components/LearnSection";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Menu />
      <main className="w-full">
        <div className="flex flex-col">
          <Hero />
          <OurStory />
          <Community />
          <Tokenomics />
          <Roadmap />
          <SmartContract />
          <LearnSection />
          <ContactUs />
        </div>
      </main>
    </div>
  );
};

export default Index;