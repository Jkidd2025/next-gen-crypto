import { Menu } from "@/components/Menu";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#9b87f5] via-[#7E69AB] to-[#6E59A5]">
      <Menu />
      <div className="container mx-auto text-center px-4 md:px-8 lg:px-16 relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8">
          Next Generation Crypto
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto">
          Building the next generation of AI-Driven Smart Contracts
        </p>
      </div>
    </div>
  );
};