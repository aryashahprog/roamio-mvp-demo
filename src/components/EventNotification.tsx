
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { formatTime } from "@/data/mockData";
import { X, MapPin, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EventNotification = () => {
  const { showNotification, setShowNotification, notificationEvent, toggleRSVP } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  
  if (!showNotification || !notificationEvent) return null;
  
  const handleRsvp = () => {
    toggleRSVP(notificationEvent.id);
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds and navigate
    setTimeout(() => {
      setShowConfirmation(false);
      setShowNotification(false);
      navigate("/feed");
    }, 3000);
  };
  
  const handleDismiss = () => {
    setShowNotification(false);
  };
  
  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {!showConfirmation ? (
          <motion.div
            key="notification"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-roamio-blue to-blue-600 p-4 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-sm">Nearby Event Alert!</h3>
              </div>
              <button 
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2 text-gray-900">{notificationEvent.title}</h4>
              
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <MapPin className="h-4 w-4 text-roamio-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{notificationEvent.location.building}</p>
                  <p className="text-xs text-gray-500">One building over • 2 min walk</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4 rounded-r-lg">
                <p className="text-sm font-medium text-amber-800">
                  Starts at {formatTime(notificationEvent.startTime)} (in 15 minutes)
                </p>
              </div>
              
              {notificationEvent.interestTags.includes("Free Food") && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-green-800">🍕 Free food available!</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleRsvp} 
                  className="flex-1 bg-roamio-blue hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg"
                >
                  I'll be there!
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDismiss} 
                  className="flex-1 border-gray-300 text-gray-700 font-medium py-3 rounded-xl"
                >
                  Not now
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 300 }}
                className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-bold text-lg"
              >
                You're all set!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-green-100 mt-1"
              >
                RSVP'd to {notificationEvent.title}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventNotification;
