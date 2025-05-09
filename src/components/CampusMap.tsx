
import { useRef, useEffect, useState } from "react";
import { Event } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventPopupProps {
  event: Event;
  onClose: () => void;
  onViewDetails: (eventId: string) => void;
}

const EventPopup = ({ event, onClose, onViewDetails }: EventPopupProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="absolute z-20 bg-white rounded-lg shadow-lg p-4 w-64"
    style={{ 
      left: `${event.location.coordinates.x}px`, 
      top: `${event.location.coordinates.y - 120}px` 
    }}
  >
    <button 
      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
      onClick={onClose}
    >
      ✕
    </button>
    
    <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
    <p className="text-xs text-gray-600 mb-2">{event.location.building}, {event.location.room}</p>
    
    <div className="flex justify-between items-center mt-3">
      <button 
        className="bg-roamio-blue text-white text-xs py-1.5 px-3 rounded-full"
        onClick={() => onViewDetails(event.id)}
      >
        View Details
      </button>
      <button
        className="text-xs text-blue-500"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Get Directions
      </button>
    </div>
  </motion.div>
);

const CampusMap = () => {
  const { filteredEvents, setShowNotification, setNotificationEvent } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Background image URL
  const mapImageUrl = "https://images.unsplash.com/photo-1501854140801-50d01698950b";
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Load background map image
    const image = new Image();
    image.src = mapImageUrl;
    image.onload = () => {
      // Draw map
      ctx.drawImage(image, 0, 0, width, height);
      
      // Draw event markers
      filteredEvents.forEach((event) => {
        const { x, y } = event.location.coordinates;
        
        // Draw pin shadow
        ctx.beginPath();
        ctx.arc(x, y + 2, 12, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
        
        // Draw pin circle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = event.isFeatured ? "#FF9F45" : "#9b87f5";
        ctx.fill();
        
        // Draw pin border
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw event icon - first letter of the first interest tag
        const firstInterest = event.interestTags[0];
        ctx.font = "bold 11px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(firstInterest.charAt(0), x, y);
        
        // Draw building name
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        
        // Draw text stroke
        ctx.strokeText(event.location.building, x, y + 25);
        // Draw text fill
        ctx.fillText(event.location.building, x, y + 25);
      });
    };
  }, [filteredEvents, selectedEvent]);
  
  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked on any event marker
    for (const event of filteredEvents) {
      const eventX = event.location.coordinates.x;
      const eventY = event.location.coordinates.y;
      
      // Calculate distance from click to event marker center
      const distance = Math.sqrt((x - eventX) ** 2 + (y - eventY) ** 2);
      
      // If clicked within 15px radius of marker
      if (distance <= 15) {
        setSelectedEvent(event);
        return;
      }
    }
    
    // If clicked elsewhere, close any open popup
    setSelectedEvent(null);
  };
  
  const handleViewDetails = (eventId: string) => {
    const event = filteredEvents.find(e => e.id === eventId);
    if (event) {
      setNotificationEvent(event);
      setShowNotification(true);
    }
    setSelectedEvent(null);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="font-semibold mb-4 text-lg">Campus Map</h2>
      <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
        <canvas 
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full h-full object-cover"
          onClick={handleCanvasClick}
        />
        
        {/* Event popup when marker is clicked */}
        <AnimatePresence>
          {selectedEvent && (
            <EventPopup 
              event={selectedEvent} 
              onClose={() => setSelectedEvent(null)}
              onViewDetails={handleViewDetails}
            />
          )}
        </AnimatePresence>
        
        <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-roamio-purple mr-2"></div>
              <span>Regular Event</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Featured Event</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">Tap markers for details</div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
          <MapPin className="h-4 w-4 text-roamio-blue mr-2" />
          <span className="text-sm">Tap a location to view events</span>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
