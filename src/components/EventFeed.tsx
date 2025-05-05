
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { interestOptions, Interest } from "@/data/mockData";
import { SlidersHorizontal } from "lucide-react";

const EventFeed = () => {
  const { filteredEvents, selectedInterests, toggleInterest } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="px-4 pb-20">
      {/* Filters toggle */}
      <div className="my-4">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex justify-between items-center"
        >
          <span>Filter events</span>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`
                  text-xs px-3 py-1.5 rounded-full border transition-colors
                  ${selectedInterests.includes(interest) 
                    ? 'bg-roamio-purple text-white border-roamio-purple' 
                    : 'bg-white text-gray-700 border-gray-200'}
                `}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Events list */}
      {sortedEvents.length > 0 ? (
        sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-gray-500 mt-1">Try selecting different interests</p>
        </div>
      )}
    </div>
  );
};

export default EventFeed;
