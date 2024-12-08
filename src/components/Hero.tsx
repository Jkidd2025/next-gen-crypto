import { Menu } from "@/components/Menu";

export const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-primary via-secondary to-accent">
      <Menu />
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          The Next Generation Meme Coin
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12">
          Join the community and be part of the meme revolution
        </p>
      </div>
    </div>
  );
};