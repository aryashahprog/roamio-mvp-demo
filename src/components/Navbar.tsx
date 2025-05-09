
import { Link, useLocation } from "react-router-dom";
import { Home, Map, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  
  const getActiveClass = (path: string) => {
    return location.pathname === path 
      ? "text-roamio-blue" 
      : "text-gray-500";
  };

  const getActiveIndicator = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      {/* Main Navigation */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 shadow-lg rounded-t-xl">
        <div className="flex justify-around items-center">
          <NavItem 
            to="/feed" 
            label="Feed"
            isActive={getActiveClass("/feed") === "text-roamio-blue"}
            showIndicator={getActiveIndicator("/feed")}
          >
            <Home strokeWidth={2} />
          </NavItem>
          
          <NavItem 
            to="/map" 
            label="Map"
            isActive={getActiveClass("/map") === "text-roamio-blue"}
            showIndicator={getActiveIndicator("/map")}
          >
            <Map strokeWidth={2} />
          </NavItem>
          
          <NavItem 
            to="/notifications" 
            label="Alerts"
            isActive={getActiveClass("/notifications") === "text-roamio-blue"}
            showIndicator={getActiveIndicator("/notifications")}
          >
            <Bell strokeWidth={2} />
          </NavItem>
          
          <NavItem 
            to="/profile" 
            label="Profile"
            isActive={getActiveClass("/profile") === "text-roamio-blue"}
            showIndicator={getActiveIndicator("/profile")}
          >
            <User strokeWidth={2} />
          </NavItem>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
  showIndicator: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, label, isActive, showIndicator, children }: NavItemProps) => (
  <Link 
    to={to} 
    className="flex flex-col items-center relative pt-2"
  >
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center w-16 py-1 ${isActive ? "text-roamio-blue" : "text-gray-500"}`}
      style={{ transformOrigin: "center center" }}
    >
      <div className="h-6 w-6 mb-1">
        {children}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </motion.div>
    {showIndicator && (
      <motion.div 
        layoutId="nav-indicator"
        className="absolute -top-2 w-1.5 h-1.5 rounded-full bg-roamio-blue"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
  </Link>
);

export default Navbar;
