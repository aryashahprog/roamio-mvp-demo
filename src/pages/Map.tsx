
import GoogleMapsView from "@/components/GoogleMapsView";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import EventNotification from "@/components/EventNotification";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Map = () => {
  const { hasCompletedOnboarding, filteredEvents } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20 shadow-sm"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Campus Map</h1>
            <p className="text-sm text-gray-500">{filteredEvents.length} events nearby</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost" 
              size="icon"
              className="text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost" 
              size="icon"
              className="text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations, events, or buildings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-roamio-blue focus:border-transparent"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Map Container */}
      <div className="relative flex-1 h-[calc(100vh-140px)]">
        <GoogleMapsView />
      </div>
      
      {/* Quick Stats Bar */}
      <div className="absolute bottom-20 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-3 shadow-lg">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-roamio-blue rounded-full"></div>
              <span className="text-gray-600">Events</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Buildings</span>
            </div>
          </div>
          <span className="text-gray-500 font-medium">Tap pins for details</span>
        </div>
      </div>
      
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default Map;
