
import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, Calendar, MapPin, Bell, BellOff } from 'lucide-react';
import { formatDate, formatTime, getInterestIcon } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const RecommendedEvents = () => {
  const { recommendedEvents, toggleRSVP, rsvpEvents, toggleEventReminder, eventReminders } = useAppContext();
  const [loadingRsvp, setLoadingRsvp] = useState<string | null>(null);
  const [loadingReminder, setLoadingReminder] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleRsvp = (eventId: string) => {
    setLoadingRsvp(eventId);
    setTimeout(() => {
      toggleRSVP(eventId);
      setLoadingRsvp(null);
    }, 500);
  };
  
  const handleToggleReminder = (eventId: string) => {
    setLoadingReminder(eventId);
    setTimeout(() => {
      toggleEventReminder(eventId);
      setLoadingReminder(null);
      
      const hasReminder = eventReminders.includes(eventId);
      toast(
        hasReminder ? 'Reminder removed' : 'Reminder set!',
        { 
          description: hasReminder 
            ? 'You will not receive notifications for this event' 
            : 'You will be notified before this event starts'
        }
      );
    }, 500);
  };

  if (recommendedEvents.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
        <Calendar className="mx-auto h-10 w-10 text-gray-300" />
        <p className="text-gray-500 mt-2 font-medium">No recommendations yet</p>
        <p className="text-sm text-gray-400 mt-1">Try selecting more interests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendedEvents.map((event) => {
        const isRsvped = !!rsvpEvents[event.id];
        const hasReminder = eventReminders.includes(event.id);
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Card className="flex overflow-hidden h-24 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              {/* Event image */}
              {event.image ? (
                <div className="w-24 h-full">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gray-300" />
                </div>
              )}
              
              {/* Event info */}
              <div className="flex-1 flex flex-col justify-center p-2.5">
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location.building}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                    {formatDate(event.date)} • {formatTime(event.startTime)}
                  </div>
                </div>
                
                {/* Interest tags - only show on tablet and larger */}
                {!isMobile && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.interestTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] flex items-center bg-gray-50 px-1.5 py-0.5 rounded-full"
                      >
                        <span className="mr-0.5">{getInterestIcon(tag)}</span>
                        <span className="text-gray-600">{tag}</span>
                      </span>
                    ))}
                    {event.interestTags.length > 2 && (
                      <span className="text-[10px] text-gray-500">
                        +{event.interestTags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col justify-center items-end pr-2.5 space-y-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRsvp(event.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isRsvped
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-roamio-blue text-white"
                  } shadow-sm`}
                  disabled={loadingRsvp === event.id}
                >
                  {loadingRsvp === event.id ? (
                    <div className="h-3 w-3 border-2 border-t-transparent rounded-full animate-spin mx-2" />
                  ) : isRsvped ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>Going</span>
                    </div>
                  ) : (
                    "RSVP"
                  )}
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleReminder(event.id)}
                  className={`text-xs p-1.5 rounded-full ${hasReminder ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                  disabled={loadingReminder === event.id}
                  title={hasReminder ? "Remove reminder" : "Set reminder"}
                >
                  {loadingReminder === event.id ? (
                    <div className="h-3 w-3 border-2 border-t-transparent rounded-full animate-spin" />
                  ) : hasReminder ? (
                    <Bell className="h-3.5 w-3.5 text-amber-500" />
                  ) : (
                    <BellOff className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </motion.button>
              </div>
            </Card>
          </motion.div>
        );
      })}
      
      {recommendedEvents.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full text-xs font-normal text-gray-600 border-gray-200 hover:bg-gray-50 mt-1"
        >
          View more recommendations
        </Button>
      )}
    </div>
  );
};

export default RecommendedEvents;
