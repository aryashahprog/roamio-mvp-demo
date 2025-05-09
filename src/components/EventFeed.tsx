
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCard, { EventCardSkeleton } from "./EventCard";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { interestOptions } from "@/data/mockData";
import { SlidersHorizontal, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const EventFeed = () => {
  const { filteredEvents, selectedInterests, toggleInterest } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  // Featured events first
  const featuredEvents = sortedEvents.filter(event => event.isFeatured);
  const regularEvents = sortedEvents.filter(event => !event.isFeatured);
  const allSortedEvents = [...featuredEvents, ...regularEvents];

  const handleMapClick = () => {
    navigate("/map");
  };

  return (
    <div className="px-4 pb-32">
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

      {/* Map quick access */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Button 
          variant="outline" 
          onClick={handleMapClick}
          className="w-full flex justify-center items-center bg-white shadow-sm border-gray-100 py-6"
        >
          <MapPin className="h-4 w-4 mr-2 text-roamio-blue" />
          <span>View events on map</span>
        </Button>
      </motion.div>
      
      {/* Featured events carousel */}
      {!isLoading && featuredEvents.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3">Featured Events</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <EventCard event={event} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
      
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
          {regularEvents.length > 0 ? (
            <div>
              <h2 className="font-semibold text-lg mb-3">All Events</h2>
              {regularEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : featuredEvents.length === 0 && (
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
