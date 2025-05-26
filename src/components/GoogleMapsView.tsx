
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// Mock Google Maps for prototype (replace with real API in production)
const GoogleMapsView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { filteredEvents } = useAppContext();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // SF coordinates for demo

  // Mock campus locations with coordinates
  const campusLocations = [
    { lat: 37.7849, lng: -122.4094, name: "Student Center" },
    { lat: 37.7749, lng: -122.4194, name: "Library" },
    { lat: 37.7649, lng: -122.4294, name: "Athletic Center" },
    { lat: 37.7949, lng: -122.3994, name: "Science Building" },
  ];

  useEffect(() => {
    // Mock Google Maps initialization
    if (mapRef.current) {
      console.log("Google Maps would be initialized here with API key");
      // In real implementation:
      // const map = new google.maps.Map(mapRef.current, { ... });
    }
  }, []);

  const handleEventPin = (event: any) => {
    setSelectedEvent(event);
  };

  const centerOnUser = () => {
    // Mock getting user location
    console.log("Centering map on user location");
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container - Mock Google Maps */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-blue-100 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)
          `
        }}
      >
        {/* Campus Buildings - Mock */}
        {campusLocations.map((location, index) => (
          <div
            key={index}
            className="absolute w-8 h-8 bg-gray-300 rounded border-2 border-gray-500 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + index * 10}%`,
            }}
          >
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
              {location.name}
            </div>
          </div>
        ))}

        {/* Event Pins */}
        {filteredEvents.slice(0, 5).map((event, index) => (
          <button
            key={event.id}
            onClick={() => handleEventPin(event)}
            className="absolute w-6 h-6 bg-roamio-blue rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform animate-pulse"
            style={{
              left: `${25 + index * 12}%`,
              top: `${40 + index * 8}%`,
            }}
          >
            <MapPin className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </button>
        ))}

        {/* User Location */}
        <div
          className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: '60%' }}
        >
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Paths/Roads - Mock */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <path
            d="M 10% 80% Q 50% 60% 90% 40%"
            stroke="#d1d5db"
            strokeWidth="8"
            fill="none"
            strokeDasharray="20,10"
            opacity="0.6"
          />
          <path
            d="M 20% 20% Q 60% 50% 80% 80%"
            stroke="#d1d5db"
            strokeWidth="6"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Center on User Button */}
      <Button
        onClick={centerOnUser}
        size="icon"
        className="absolute bottom-4 right-4 bg-white text-roamio-blue border border-gray-200 shadow-lg hover:bg-gray-50"
      >
        <Navigation className="h-4 w-4" />
      </Button>

      {/* Event Preview Card */}
      {selectedEvent && (
        <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{selectedEvent.title}</h3>
            <button 
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">{selectedEvent.location.building}</p>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              View Details
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Get Directions
            </Button>
          </div>
        </div>
      )}

      {/* Mock API Key Notice */}
      <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-800">
        📍 Demo Map - Replace with Google Maps API
      </div>
    </div>
  );
};

export default GoogleMapsView;
