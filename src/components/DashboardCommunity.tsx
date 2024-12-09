import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export const DashboardCommunity = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-xl">Welcome to our hub!</p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">Active Members</h3>
                  <p className="text-3xl font-bold">5,234</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">Daily Discussions</h3>
                  <p className="text-3xl font-bold">127</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Token Counsel Members</h2>
          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4">
            {tokenCounselMembers.map((member, index) => (
              <Card key={index} className="flex-shrink-0 w-64">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                  <a 
                    href={member.contact}
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Contact
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};