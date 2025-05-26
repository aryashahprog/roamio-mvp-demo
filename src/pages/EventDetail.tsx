
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatTime } from "@/data/mockData";
import { MapPin, Calendar, Clock, Users, ArrowLeft, Bookmark, Share2, BookmarkMinus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import EventNotification from "@/components/EventNotification";
import FriendsRsvp from "@/components/FriendsRsvp";
import { useState } from "react";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    events, 
    toggleRSVP, 
    rsvpEvents, 
    checkedInEvents, 
    checkInToEvent, 
    bookmarkEvent, 
    bookmarkedEvents 
  } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // Find the event by ID
  const event = events.find(e => e.id === id);

  // Handle case when event is not found
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Event not found</h2>
        <Button onClick={() => navigate('/feed')}>Back to Feed</Button>
      </div>
    );
  }

  const isRsvped = !!rsvpEvents[event.id];
  const isBookmarked = bookmarkedEvents.includes(event.id);
  const checkedInTimestamp = checkedInEvents[event.id];

  // Calculate if event is happening today (for demo purposes)
  const eventDate = new Date(event.date);
  const today = new Date();
  const isToday = 
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear();

  const handleRSVP = () => {
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      toggleRSVP(event.id);
      setIsLoading(false);
      
      if (!isRsvped) {
        toast.success("You've RSVP'd to this event!", {
          description: "You'll receive a notification before it starts."
        });
      }
    }, 500);
  };

  const handleBookmark = () => {
    bookmarkEvent(event.id);
    
    toast.success(isBookmarked ? "Event removed from bookmarks" : "Event saved to bookmarks", {
      duration: 2000
    });
  };

  const handleShare = () => {
    // Would implement actual share functionality in a real app
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header with back button */}
      <div className="bg-roamio-blue text-white p-4 sticky top-0 z-10 shadow-sm flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/20 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Event Details</h1>
          <p className="text-sm text-white/80">{event.location.building}</p>
        </div>
      </div>

      <div className="pb-12">
        {/* Event Image */}
        <div className="relative">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-roamio-blue/30" />
            </div>
          )}
          
          {/* Action buttons floating over image */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmark}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
            >
              {isBookmarked ? (
                <BookmarkMinus className="h-5 w-5 text-roamio-blue" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-700" />
              )}
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
            >
              <Share2 className="h-5 w-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
        
        {/* Event Title and Details */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-3" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-3" />
              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-3" />
              <span>{event.location.building}, {event.location.room}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-3" />
              <span>{event.attendees || Math.floor(Math.random() * 50) + 10} attending</span>
            </div>
          </div>
          
          {/* Friends RSVP section */}
          <div className="mt-4">
            <FriendsRsvp eventId={event.id} />
          </div>
          
          {/* Description */}
          <Card className="mt-6 p-4 shadow-sm border-gray-100">
            <h2 className="font-semibold mb-2">About this event</h2>
            <p className="text-gray-700">{event.description}</p>
          </Card>
          
          {/* Interest Tags */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {event.interestTags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Who's Attending */}
          <div className="mt-6">
            <h2 className="font-semibold mb-3">Who's attending</h2>
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <Avatar key={i} className="border-2 border-white">
                  <AvatarFallback className="bg-roamio-blue text-white">
                    {String.fromCharCode(65 + i)}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs border-2 border-white">
                +{(event.attendees || Math.floor(Math.random() * 50) + 10) - 5}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <Button 
              className={`flex-1 py-6 ${isRsvped ? "bg-blue-50 text-roamio-blue border border-blue-100" : ""}`}
              variant={isRsvped ? "outline" : "default"}
              onClick={handleRSVP}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>{isRsvped ? "Cancelling..." : "RSVP'ing..."}</span>
                </div>
              ) : (
                <>{isRsvped ? "Cancel RSVP" : "RSVP to Event"}</>
              )}
            </Button>
            
            {isToday && !checkedInTimestamp && (
              <Button 
                variant="outline" 
                className="flex-1 py-6"
                onClick={() => checkInToEvent(event.id)}
              >
                Check In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default EventDetail;
