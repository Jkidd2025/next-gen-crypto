import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
}

export const EventCard = ({
  title,
  description,
  startDate,
  endDate,
  location,
  type,
}: EventCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{title}</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {type}
            </span>
          </div>
          <p className="text-muted-foreground">{description}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(startDate).toLocaleDateString()} -{" "}
                {new Date(endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(startDate).toLocaleTimeString()} -{" "}
                {new Date(endDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};