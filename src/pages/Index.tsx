import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { Menu } from "@/components/Menu";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="fixed top-8 right-8 z-50 hidden md:block">
        <Button 
          onClick={() => navigate("/login")}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </div>
      <Hero />
      <OurStory />
      <Community />
      <Tokenomics />
      <Roadmap />
      <SmartContract />
      <ContactUs />
    </div>
  );
};

export default Index;