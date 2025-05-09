
import { useState } from 'react';
import { Event } from '@/data/mockData';
import { useAppContext } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import { formatDate, formatTime, getInterestIcon } from '@/data/mockData';

const RecommendedEvents = () => {
  const { recommendedEvents, toggleRSVP, rsvpEvents } = useAppContext();
  const [loadingRsvp, setLoadingRsvp] = useState<string | null>(null);

  const handleRsvp = (eventId: string) => {
    setLoadingRsvp(eventId);
    setTimeout(() => {
      toggleRSVP(eventId);
      setLoadingRsvp(null);
    }, 500);
  };

  if (recommendedEvents.length === 0) {
    return (
      <div className="text-center py-6 bg-white rounded-lg shadow-sm">
        <Calendar className="mx-auto h-10 w-10 text-gray-300" />
        <p className="text-gray-500 mt-2">No recommendations yet</p>
        <p className="text-xs text-gray-400">Try selecting more interests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendedEvents.map((event) => {
        const isRsvped = !!rsvpEvents[event.id];
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <Card className="flex overflow-hidden h-24 border-none shadow-sm">
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
                  <Calendar className="h-8 w-8 text-gray-300" />
                </div>
              )}
              
              {/* Event info */}
              <div className="flex-1 flex flex-col justify-between p-3">
                <div>
                  <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location.building}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(event.date)} • {formatTime(event.startTime)}
                  </div>
                </div>
              </div>
              
              {/* RSVP button */}
              <div className="flex items-center pr-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRsvp(event.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    isRsvped
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-roamio-blue text-white"
                  }`}
                  disabled={loadingRsvp === event.id}
                >
                  {loadingRsvp === event.id ? (
                    <div className="h-3 w-3 border-2 border-t-transparent rounded-full animate-spin mx-3" />
                  ) : isRsvped ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>Going</span>
                    </div>
                  ) : (
                    "RSVP"
                  )}
                </motion.button>
              </div>
              
              {/* Interest tags */}
              <div className="absolute top-0 left-0 ml-24 mt-1">
                <div className="flex space-x-1">
                  {event.interestTags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] flex items-center bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm"
                    >
                      <span>{getInterestIcon(tag)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RecommendedEvents;
