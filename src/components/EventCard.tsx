
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, getInterestTagClass, formatDate, formatTime, getInterestIcon } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { ChevronDown, MapPin, Clock, CheckCircle, Users, Calendar, Bookmark, BookmarkMinus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import FriendsRsvp from "@/components/FriendsRsvp";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const { rsvpEvents, toggleRSVP, checkedInEvents, checkInToEvent, bookmarkEvent, bookmarkedEvents } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRsvpSuccess, setShowRsvpSuccess] = useState(false);
  
  const isRsvped = !!rsvpEvents[event.id];
  const checkedInTimestamp = checkedInEvents[event.id];
  const isBookmarked = bookmarkedEvents.includes(event.id);
  
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

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    setTimeout(() => {
      toggleRSVP(event.id);
      setIsLoading(false);
      
      if (!isRsvped) {
        setShowRsvpSuccess(true);
        setTimeout(() => setShowRsvpSuccess(false), 3000);
      }
    }, 500);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkEvent(event.id);
    
    toast.success(isBookmarked ? "Event removed from bookmarks" : "Event saved to bookmarks", {
      duration: 2000
    });
  };

  const handleShowDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-3"
      layout
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-md relative active:scale-[0.99]">
        {event.isFeatured && (
          <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-amber-500 to-amber-400 text-white px-3 py-1 text-xs font-medium rounded-bl-md">
            Featured
          </div>
        )}
        
        <CardContent className="p-0">
          {/* Bookmark button */}
          <motion.button
            className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
          >
            {isBookmarked ? (
              <BookmarkMinus className="h-4 w-4 text-roamio-blue" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-600" />
            )}
          </motion.button>
          
          {/* Event Image */}
          {event.image ? (
            <motion.div 
              className="relative w-full h-40"
              layoutId={`event-image-${event.id}`}
            >
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              
              {/* RSVP Success Animation */}
              <AnimatePresence>
                {showRsvpSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  >
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="bg-white rounded-full p-3 shadow-lg"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3, type: "spring" }}
                      >
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Interest Tags on image */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex flex-wrap gap-1.5">
                  {event.interestTags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-full bg-white/20 text-white border-none backdrop-blur-sm flex items-center"
                    >
                      <span className="mr-1">{getInterestIcon(tag)}</span>
                      {tag}
                    </span>
                  ))}
                  {event.interestTags.length > 2 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                      +{event.interestTags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-roamio-blue/30" />
            </div>
          )}
          
          {/* Event Info */}
          <div className="p-4">
            {/* Event header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{event.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{event.location.building}</span>
                  <span className="mx-2 text-xs">•</span>
                  <span className="text-xs">{getDistanceText()}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formatDate(event.date)}</span>
                  <span className="mx-2 text-xs">•</span>
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{event.attendees || Math.floor(Math.random() * 50) + 10} attending</span>
                </div>
              </div>
            </div>
            
            {/* Friends RSVP section */}
            <FriendsRsvp eventId={event.id} className="mb-3" />
            
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
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 text-sm mb-4">{event.description}</p>
                    <div className="text-sm text-gray-600 mb-4">
                      <div><strong>Location:</strong> {event.location.building}, {event.location.room}</div>
                    </div>
                    
                    {/* All interest tags (when expanded) */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {event.interestTags.map((tag) => (
                        <span 
                          key={tag} 
                          className={`text-xs px-2.5 py-1 rounded-full border flex items-center ${getInterestTagClass(tag)}`}
                        >
                          <span className="mr-1">{getInterestIcon(tag)}</span>
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
              onClick={handleShowDetails} 
              className="w-full flex items-center justify-center text-sm text-gray-500 py-2 mt-2 hover:text-gray-700 transition-colors"
            >
              {expanded ? 'Show less' : 'Show more'}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${expanded ? 'transform rotate-180' : ''}`} />
            </button>
            
            {/* Action buttons */}
            <div className="mt-3 flex gap-3">
              <Button 
                variant={isRsvped ? "secondary" : "default"}
                className={`flex-1 py-3 relative overflow-hidden transition-all duration-300 ${
                  isRsvped 
                    ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" 
                    : "bg-roamio-blue hover:bg-blue-600"
                }`}
                onClick={handleRSVP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2"></div>
                    <span>{isRsvped ? "Cancelling..." : "RSVP'ing..."}</span>
                  </div>
                ) : (
                  <>
                    {isRsvped && <CheckCircle className="h-4 w-4 mr-2" />}
                    {isRsvped ? "Going" : "RSVP"}
                  </>
                )}
              </Button>
              
              {isToday && !checkedInTimestamp && (
                <Button 
                  variant="outline" 
                  className="flex-1 py-3 border-blue-200 text-roamio-blue hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    checkInToEvent(event.id);
                  }}
                >
                  Check In
                </Button>
              )}
              
              {checkedInTimestamp && (
                <div className="flex-1 text-center bg-green-50 rounded-md p-3 text-sm text-green-700 border border-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
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
  <Card className="overflow-hidden transition-all duration-200 mb-4 border-none shadow-sm">
    <CardContent className="p-0">
      <Skeleton className="w-full h-44" />
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
