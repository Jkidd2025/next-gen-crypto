import { Menu } from "@/components/Menu";

export const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-primary via-secondary to-accent">
      <Menu />
      <div className="container mx-auto text-center px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8">
          Next Generation Crypto
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-white mb-12 max-w-4xl mx-auto">
          Join the community and be part of the revolution
        </p>
      </div>
    </div>
  );
};