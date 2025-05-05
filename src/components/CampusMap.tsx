
import { useRef, useEffect } from "react";
import { Event } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";

const CampusMap = () => {
  const { filteredEvents } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
        
        // Draw pin circle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "#9b87f5";
        ctx.fill();
        
        // Draw pin border
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw event name
        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(event.location.building, x, y + 25);
      });
    };
  }, [filteredEvents]);
  
  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="font-semibold mb-4 text-lg">Campus Map</h2>
      <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-roamio-purple mr-2"></div>
            <span>Event Location</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Tap on a marker to view event details</p>
      </div>
    </div>
  );
};

export default CampusMap;
