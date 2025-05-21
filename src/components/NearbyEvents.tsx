
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { formatTime, getInterestIcon } from "@/data/mockData";
import { Clock, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

const NearbyEvents = () => {
  const { events } = useAppContext();
  const navigate = useNavigate();
  const [nearbyEvents, setNearbyEvents] = useState([]);

  useEffect(() => {
    // In a real app, this would use geolocation to find truly nearby events
    // For demo, we'll just use the first few events
    setNearbyEvents(events.slice(0, 5));
  }, [events]);
  
  if (nearbyEvents.length === 0) {
    return (
      <div className="p-4">
        <Card className="p-6 text-center bg-gray-50">
          <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No events nearby</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex justify-between items-center px-4 mb-2">
        <h3 className="font-semibold text-lg">Events Near Me</h3>
        <Button 
          variant="ghost" 
          className="text-xs text-roamio-blue py-1 h-auto"
          onClick={() => navigate('/map')}
        >
          View Map
        </Button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {nearbyEvents.map((event) => (
            <CarouselItem key={event.id} className="basis-4/5 pl-4 first:pl-4">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="h-full"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <Card className="overflow-hidden h-full border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  {/* Event image or placeholder */}
                  <div className="relative h-32">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Distance indicator */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs rounded-full px-2 py-0.5 backdrop-blur-sm">
                      {Math.floor(Math.random() * 10) + 1} min away
                    </div>
                  </div>
                  
                  {/* Event info */}
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                    
                    <div className="flex items-center mt-1.5 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{event.location.building}</span>
                    </div>
                    
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Today, {formatTime(event.startTime)}</span>
                    </div>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-2">
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
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
          
          <CarouselItem className="basis-1/5 pl-4">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="h-full flex items-center justify-center"
              onClick={() => navigate('/map')}
            >
              <Button variant="outline" className="h-auto py-6 px-5">
                View All
              </Button>
            </motion.div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default NearbyEvents;
