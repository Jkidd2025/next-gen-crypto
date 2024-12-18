import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { LearnSection } from "@/components/LearnSection";
import { TestIntegration } from "@/components/TestIntegration";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <main className="w-full">
        <div className="flex flex-col">
          <Hero />
          <TestIntegration />
          <OurStory />
          <Tokenomics />
          <Roadmap />
          <SmartContract />
          <LearnSection />
          <Community />
          <ContactUs />
        </div>
      </main>
    </div>
  );
};

export default Index;