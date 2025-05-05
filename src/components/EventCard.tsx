
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, getInterestTagClass, formatDate, formatTime } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { ChevronDown, MapPin, Clock } from "lucide-react";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { rsvpEvents, toggleRSVP, checkedInEvents, checkInToEvent } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  
  const isRsvped = !!rsvpEvents[event.id];
  const checkedInTimestamp = checkedInEvents[event.id];
  
  // Calculate if event is happening now (for demo purposes, using today's date)
  const eventDate = new Date(event.date);
  const today = new Date();
  const isToday = 
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear();
  
  // Get distance text (mock values for demo)
  const getDistanceText = () => {
    const distances = ["1 min away", "5 mins away", "Building over", "Across campus", "2 buildings away"];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200">
      <CardContent className="p-0">
        {event.image && (
          <div className="relative w-full h-48">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-4">
          {/* Event header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{event.location.building}</span>
                <span className="mx-1.5 text-xs">•</span>
                <span>{getDistanceText()}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{formatDate(event.date)}</span>
                <span className="mx-1.5 text-xs">•</span>
                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
              </div>
            </div>
          </div>
          
          {/* Interest tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {event.interestTags.map((tag) => (
              <span 
                key={tag} 
                className={`text-xs px-2.5 py-1 rounded-full border ${getInterestTagClass(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Expandable content */}
          <div className={`mt-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-64' : 'max-h-0'}`}>
            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              <div><strong>Location:</strong> {event.location.building}, {event.location.room}</div>
            </div>
          </div>
          
          {/* Button to expand/collapse */}
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="w-full flex items-center justify-center text-sm text-gray-500 py-2 hover:text-gray-700"
          >
            {expanded ? 'Show less' : 'Show more'}
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
          </button>
          
          {/* Action buttons */}
          <div className="mt-2 flex gap-2">
            <Button 
              variant={isRsvped ? "secondary" : "default"}
              className="flex-1 py-5"
              onClick={() => toggleRSVP(event.id)}
            >
              {isRsvped ? "Cancel RSVP" : "RSVP"}
            </Button>
            
            {isToday && !checkedInTimestamp && (
              <Button 
                variant="outline" 
                className="flex-1 py-5"
                onClick={() => checkInToEvent(event.id)}
              >
                Check In
              </Button>
            )}
            
            {checkedInTimestamp && (
              <div className="flex-1 text-center bg-gray-50 rounded-md p-2 text-xs text-gray-500">
                Checked in: <br />
                {checkedInTimestamp}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
