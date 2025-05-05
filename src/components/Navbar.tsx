
import { Link, useLocation } from "react-router-dom";
import { Home, Map, Bell, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const getActiveClass = (path: string) => {
    return location.pathname === path 
      ? "text-roamio-blue" 
      : "text-gray-500";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
      <div className="flex justify-around">
        <Link 
          to="/feed" 
          className={`flex flex-col items-center ${getActiveClass("/feed")}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Feed</span>
        </Link>
        <Link 
          to="/map" 
          className={`flex flex-col items-center ${getActiveClass("/map")}`}
        >
          <Map className="h-6 w-6" />
          <span className="text-xs mt-1">Map</span>
        </Link>
        <Link 
          to="/notifications" 
          className={`flex flex-col items-center ${getActiveClass("/notifications")}`}
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs mt-1">Notifications</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center ${getActiveClass("/profile")}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
