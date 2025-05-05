
import { useAppContext } from "@/contexts/AppContext";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";

const MyEvents = () => {
  const { events, rsvpEvents, checkedInEvents } = useAppContext();
  const [activeTab, setActiveTab] = useState<"rsvp" | "attended">("rsvp");
  
  // Filter for RSVP'd events
  const rsvpedEvents = events.filter(event => rsvpEvents[event.id]);
  
  // Filter for checked-in events
  const attendedEvents = events.filter(event => checkedInEvents[event.id]);
  
  // Handle when there are no events
  if (rsvpedEvents.length === 0 && attendedEvents.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
          <Calendar className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mt-6 text-lg font-medium">No events yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          RSVP to events from the feed or check in at an event
        </p>
        <button 
          onClick={() => window.location.href = '/feed'}
          className="mt-6 flex items-center justify-center text-sm text-roamio-blue mx-auto hover:underline"
        >
          Browse events
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden bg-gray-100">
        <button 
          onClick={() => setActiveTab("rsvp")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "rsvp" 
              ? "bg-white text-roamio-blue shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Upcoming ({rsvpedEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab("attended")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "attended" 
              ? "bg-white text-roamio-blue shadow-sm" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          History ({attendedEvents.length})
        </button>
      </div>
      
      {/* RSVP'd Events */}
      {activeTab === "rsvp" && rsvpedEvents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {rsvpedEvents.map(event => (
            <motion.div 
              key={`rsvp-${event.id}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-white overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                {event.image && (
                  <div className="relative h-32 w-full">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-xs font-medium">
                        RSVP'd
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <CardDescription className="text-xs flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(event.date)} • {formatTime(event.startTime)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 text-sm">
                  <p className="text-gray-600">{event.location.building}, {event.location.room}</p>
                </CardContent>
                <CardFooter className="pt-0 flex-wrap gap-2">
                  {event.interestTags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Attended Events */}
      {activeTab === "attended" && attendedEvents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {attendedEvents.map(event => (
            <motion.div 
              key={`attended-${event.id}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-white overflow-hidden border-none shadow-sm">
                {event.image && (
                  <div className="relative h-32 w-full bg-gray-100">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <span className="text-xs text-white flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                        Attended
                      </span>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(event.date)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </CardDescription>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600">{event.location.building}, {event.location.room}</p>
                  <p className="text-xs mt-1 text-green-600 font-medium">
                    Checked in: {checkedInEvents[event.id]}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex-wrap gap-2">
                  {event.interestTags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyEvents;
