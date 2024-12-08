import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-primary via-secondary to-accent">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
          The Next Big Meme Coin 🚀
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12">
          Join the community and be part of the meme revolution
        </p>
        <Button className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6">
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};