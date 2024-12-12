import { CreateEventDialog } from "./events/CreateEventDialog";
import { EventCard } from "./events/EventCard";

export const CommunityEvents = () => {
  // Mock data for demonstration
  const events = [
    {
      id: 1,
      title: "Community AMA Session",
      description: "Join us for a live AMA with the development team",
      startDate: "2024-03-25T14:00:00",
      endDate: "2024-03-25T15:00:00",
      location: "Discord",
      type: "community",
    },
    {
      id: 2,
      title: "Token Holder Meeting",
      description: "Quarterly meeting for token holders",
      startDate: "2024-04-01T10:00:00",
      endDate: "2024-04-01T11:30:00",
      location: "Zoom",
      type: "governance",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Events</h2>
        <CreateEventDialog />
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};