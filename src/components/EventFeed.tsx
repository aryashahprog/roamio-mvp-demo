
import { useState, useEffect } from "react";
import EventCard, { EventCardSkeleton } from "./EventCard";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { interestOptions } from "@/data/mockData";
import { SlidersHorizontal, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EventFeed = () => {
  const { filteredEvents, selectedInterests, toggleInterest } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Sort events by start time and date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Compare dates first
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If same date, compare times
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="px-4 pb-24">
      {/* Filters toggle */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-4"
      >
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex justify-between items-center bg-white shadow-sm border-gray-100"
        >
          <span>Filter events</span>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </motion.div>
      
      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
              <h3 className="text-sm font-medium mb-3 text-gray-700">What are you interested in?</h3>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      text-xs px-3 py-2 rounded-full border transition-all duration-300
                      ${selectedInterests.includes(interest) 
                        ? 'bg-roamio-blue text-white border-roamio-blue shadow-sm' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading state */}
      {isLoading && (
        <div>
          {[1, 2, 3].map((i) => (
            <EventCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}
      
      {/* Events list */}
      {!isLoading && (
        <>
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mt-6">No events found</h3>
              <p className="text-gray-500 mt-2 mb-6">Try selecting different interests</p>
              <Button 
                onClick={() => setShowFilters(true)}
                variant="outline"
                className="mx-auto"
              >
                Adjust filters
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default EventFeed;
