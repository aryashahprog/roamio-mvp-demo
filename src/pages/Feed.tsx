
import { useState, useEffect } from "react";
import EventFeed from "@/components/EventFeed";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import EventNotification from "@/components/EventNotification";
import NearbyEvents from "@/components/NearbyEvents";
import { motion } from "framer-motion";

const Feed = () => {
  const { hasCompletedOnboarding } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-roamio-blue text-white p-4 sticky top-0 z-10 shadow-sm"
      >
        <h1 className="text-xl font-bold">Roamio</h1>
        <p className="text-sm text-white/80">Discover campus events</p>
      </motion.div>
      
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Nearby Events Carousel */}
          <div className="my-4">
            <NearbyEvents />
          </div>
          
          {/* Main Event Feed */}
          <EventFeed />
        </motion.div>
      )}
      
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default Feed;
