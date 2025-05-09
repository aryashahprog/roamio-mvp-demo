
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
      <div className="bg-white border-t border-gray-100 px-4 py-2 shadow-lg">
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
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-roamio-blue transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.254 1.234.6 1.794 1.16.56.56.906 1.126 1.16 1.794.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.903 4.903 0 01-1.16 1.794c-.56.56-1.126.906-1.794 1.16-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.903 4.903 0 01-1.794-1.16 4.903 4.903 0 01-1.16-1.794c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.254-.668.6-1.234 1.16-1.794.56-.56 1.126-.906 1.794-1.16.636-.247 1.363-.416 2.427-.465C9.516 2.013 9.871 2 12.315 2z" clipRule="evenodd"/>
            </svg>
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-roamio-blue transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"/>
            </svg>
          </a>
        </div>
        <div className="flex space-x-4 text-xs text-gray-500">
          <a href="#" className="hover:text-roamio-blue transition-colors">Contact Us</a>
          <a href="#" className="hover:text-roamio-blue transition-colors">Feedback</a>
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
