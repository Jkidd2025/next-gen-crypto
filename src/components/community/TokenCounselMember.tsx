import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TokenCounselMemberProps {
  name: string;
  role: string;
  image: string;
  contact: string;
}

export const TokenCounselMember = ({ name, role, image, contact }: TokenCounselMemberProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
        <Avatar className="w-20 h-20">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
        <a 
          href={contact}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Contact
        </a>
      </CardContent>
    </Card>
  );
};