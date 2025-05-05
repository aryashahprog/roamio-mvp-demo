
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, getInterestTagClass, formatDate, formatTime } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { ChevronDown, MapPin, Clock, CheckCircle, Users, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { rsvpEvents, toggleRSVP, checkedInEvents, checkInToEvent } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRsvpSuccess, setShowRsvpSuccess] = useState(false);
  
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

  const handleRSVP = () => {
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      toggleRSVP(event.id);
      setIsLoading(false);
      
      if (!isRsvped) {
        setShowRsvpSuccess(true);
        setTimeout(() => setShowRsvpSuccess(false), 2000);
      }
    }, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="overflow-hidden transition-all duration-300 border-none shadow-md hover:shadow-lg">
        <CardContent className="p-0">
          {/* Event Image */}
          {event.image ? (
            <motion.div 
              className="relative w-full h-48"
              layoutId={`event-image-${event.id}`}
            >
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              
              {/* RSVP Success Indicator */}
              <AnimatePresence>
                {showRsvpSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-full p-3">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Interest Tags on image */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex flex-wrap gap-1.5">
                  {event.interestTags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className={`text-xs px-2 py-1 rounded-full bg-white/20 text-white border-none backdrop-blur-sm`}
                    >
                      {tag}
                    </span>
                  ))}
                  {event.interestTags.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white border-none backdrop-blur-sm">
                      +{event.interestTags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-roamio-blue/30" />
            </div>
          )}
          
          {/* Event Info */}
          <div className="p-4">
            {/* Event header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                <div className="flex items-center text-gray-600 text-xs mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{event.location.building}</span>
                  <span className="mx-1.5 text-xs">•</span>
                  <span>{getDistanceText()}</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs mt-1.5">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(event.date)}</span>
                  <span className="mx-1.5 text-xs">•</span>
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs mt-1.5">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{Math.floor(Math.random() * 50) + 10} attending</span>
                </div>
              </div>
            </div>
            
            {/* Expandable content */}
            <AnimatePresence>
              {expanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <p className="text-gray-700 text-sm mb-4">{event.description}</p>
                    <div className="text-sm text-gray-600 mb-4">
                      <div><strong>Location:</strong> {event.location.building}, {event.location.room}</div>
                    </div>
                    
                    {/* All interest tags (when expanded) */}
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Button to expand/collapse */}
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="w-full flex items-center justify-center text-sm text-gray-500 py-3 mt-2 hover:text-gray-700"
            >
              {expanded ? 'Show less' : 'Show more'}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${expanded ? 'transform rotate-180' : ''}`} />
            </button>
            
            {/* Action buttons */}
            <div className="mt-2 flex gap-2">
              <Button 
                variant={isRsvped ? "secondary" : "default"}
                className={`flex-1 py-5 relative overflow-hidden ${isRsvped ? "bg-blue-50 text-roamio-blue border border-blue-100" : ""}`}
                onClick={handleRSVP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    <span>{isRsvped ? "Cancelling..." : "RSVP'ing..."}</span>
                  </div>
                ) : (
                  <>
                    {isRsvped && <CheckCircle className="h-4 w-4 mr-1.5" />}
                    {isRsvped ? "Going" : "RSVP"}
                  </>
                )}
              </Button>
              
              {isToday && !checkedInTimestamp && (
                <Button 
                  variant="outline" 
                  className="flex-1 py-5 border-blue-200"
                  onClick={() => checkInToEvent(event.id)}
                >
                  Check In
                </Button>
              )}
              
              {checkedInTimestamp && (
                <div className="flex-1 text-center bg-green-50 rounded-md p-2 text-xs text-green-700 border border-green-100">
                  <CheckCircle className="h-3.5 w-3.5 mx-auto mb-1" />
                  <span>Checked in</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Loading skeleton for EventCard
export const EventCardSkeleton = () => (
  <Card className="overflow-hidden transition-all duration-200 mb-4 border-none shadow-md">
    <CardContent className="p-0">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-1.5" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default EventCard;
