
import { useAppContext } from "@/contexts/AppContext";
import { CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const MyEvents = () => {
  const { events, rsvpEvents, checkedInEvents } = useAppContext();
  
  // Filter for RSVP'd events
  const rsvpedEvents = events.filter(event => rsvpEvents[event.id]);
  
  // Filter for checked-in events
  const attendedEvents = events.filter(event => checkedInEvents[event.id]);
  
  // Handle when there are no events
  if (rsvpedEvents.length === 0 && attendedEvents.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No events yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          RSVP to events from the feed or check in at an event
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* RSVP'd Events */}
      {rsvpedEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Your RSVP'd Events</h3>
          <div className="space-y-3">
            {rsvpedEvents.map(event => (
              <Card key={`rsvp-${event.id}`} className="bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(event.date)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 text-sm">
                  <p className="text-gray-600">{event.location.building}, {event.location.room}</p>
                </CardContent>
                <CardFooter className="pt-0 flex-wrap gap-2">
                  {event.interestTags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Attended Events */}
      {attendedEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Your Attended Events</h3>
          <div className="space-y-3">
            {attendedEvents.map(event => (
              <Card key={`attended-${event.id}`} className="bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(event.date)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </CardDescription>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600">{event.location.building}, {event.location.room}</p>
                  <p className="text-xs mt-1 text-green-600">
                    Checked in: {checkedInEvents[event.id]}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex-wrap gap-2">
                  {event.interestTags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
