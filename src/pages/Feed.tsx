
import EventFeed from "@/components/EventFeed";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import EventNotification from "@/components/EventNotification";

const Feed = () => {
  const { hasCompletedOnboarding } = useAppContext();
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold">Roamio</h1>
        <p className="text-sm text-gray-500">Discover campus events</p>
      </div>
      
      <EventFeed />
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default Feed;
