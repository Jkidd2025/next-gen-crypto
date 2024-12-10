import { Card, CardContent } from "@/components/ui/card";
import { TokenCounselMember } from "./TokenCounselMember";

const tokenCounselMembers = [
  {
    name: "Sarah Johnson",
    role: "Lead Strategist",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    contact: "mailto:sarah@example.com"
  },
  {
    name: "Michael Chen",
    role: "Technical Advisor",
    image: "https://images.unsplash.com/photo-1581092795360-662d53c6d0c8",
    contact: "mailto:michael@example.com"
  },
  {
    name: "Emma Davis",
    role: "Community Lead",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    contact: "mailto:emma@example.com"
  },
  {
    name: "James Wilson",
    role: "Security Expert",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    contact: "mailto:james@example.com"
  },
  {
    name: "Lisa Rodriguez",
    role: "Financial Advisor",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    contact: "mailto:lisa@example.com"
  }
];

export const TokenCounselList = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6">Token Counsel Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokenCounselMembers.map((member, index) => (
            <TokenCounselMember key={index} {...member} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};