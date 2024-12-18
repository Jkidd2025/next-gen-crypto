import { useEffect } from "react";
import { Hero } from "../components/Hero";
import { OurStory } from "../components/OurStory";
import { Roadmap } from "../components/Roadmap";
import { Tokenomics } from "../components/Tokenomics";
import { SmartContract } from "../components/SmartContract";
import { Community } from "../components/Community";
import { ContactUs } from "../components/ContactUs";
import { LearnSection } from "../components/LearnSection";

const Index = () => {
  useEffect(() => {
    console.log("Index page mounted");
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <main className="w-full">
        <div className="flex flex-col">
          <Hero />
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