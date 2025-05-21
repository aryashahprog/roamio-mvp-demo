
import CampusMap from "@/components/CampusMap";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import EventNotification from "@/components/EventNotification";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Map = () => {
  const { hasCompletedOnboarding, filteredEvents } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-roamio-blue text-white p-4 sticky top-0 z-10 shadow-sm"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Campus Map</h1>
          <div className="flex space-x-2">
            <Button
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search bar that appears when search icon is clicked */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations or events..."
                  className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between mt-2">
          <div className="text-sm text-white/80">Find nearby events</div>
          <div className="text-sm text-white/80">{filteredEvents.length} events</div>
        </div>
      </motion.div>
      
      {/* Map Container */}
      <div className="relative flex-1 h-[calc(100vh-132px)]">
        <CampusMap />
      </div>
      
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default Map;
