
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { formatTime } from "@/data/mockData";
import { X, MapPin } from "lucide-react";

const EventNotification = () => {
  const { showNotification, setShowNotification, notificationEvent, toggleRSVP } = useAppContext();
  const navigate = useNavigate();
  
  if (!showNotification || !notificationEvent) return null;
  
  const handleRsvp = () => {
    toggleRSVP(notificationEvent.id);
    setShowNotification(false);
    navigate("/feed");
  };
  
  const handleDismiss = () => {
    setShowNotification(false);
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between bg-roamio-purple p-3 text-white">
          <h3 className="font-medium">Nearby Event Alert!</h3>
          <button onClick={handleDismiss}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <h4 className="font-semibold mb-2">{notificationEvent.title}</h4>
          
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm">{notificationEvent.location.building}</p>
              <p className="text-xs text-gray-500">One building over</p>
            </div>
          </div>
          
          <p className="text-sm mb-3">
            <strong>Starts at {formatTime(notificationEvent.startTime)}</strong> (in 15 minutes)
          </p>
          
          {notificationEvent.interestTags.includes("Free Food") && (
            <p className="text-sm mb-4">There's free food! 🍕</p>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleRsvp} className="flex-1">
              I'll be there!
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="flex-1">
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventNotification;
