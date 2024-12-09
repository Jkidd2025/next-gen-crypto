import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { OurStory } from "@/components/OurStory";
import { Roadmap } from "@/components/Roadmap";
import { Tokenomics } from "@/components/Tokenomics";
import { SmartContract } from "@/components/SmartContract";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { Menu } from "@/components/Menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is a temporary solution for demonstration
    toast({
      title: "Success",
      description: "Logged in successfully",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen">
      <Menu />
      <Hero />
      <div className="fixed top-8 right-8 z-50 hidden md:block">
        <form onSubmit={handleLogin} className="flex gap-4 items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 border-white/20 text-white placeholder:text-white/50 w-48"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/20 border-white/20 text-white placeholder:text-white/50 w-48"
            required
          />
          <Button 
            type="submit"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Login
          </Button>
        </form>
      </div>
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