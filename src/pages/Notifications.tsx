
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/data/mockData";
import { ChevronRight } from "lucide-react";
import EventNotification from "@/components/EventNotification";

// Mock notifications based on user interests and RSVPs
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  eventId?: string;
  read: boolean;
}

const Notifications = () => {
  const { hasCompletedOnboarding, events, rsvpEvents, selectedInterests } = useAppContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  // Generate mock notifications
  useEffect(() => {
    const generatedNotifications: Notification[] = [];
    
    // Add notifications for events user has RSVP'd to
    Object.entries(rsvpEvents).forEach(([eventId, hasRsvp]) => {
      if (hasRsvp) {
        const event = events.find(e => e.id === eventId);
        if (event) {
          generatedNotifications.push({
            id: `rsvp-${eventId}`,
            title: "Upcoming Event Reminder",
            message: `${event.title} starts at ${formatTime(event.startTime)} on ${formatDate(event.date)}`,
            timestamp: new Date().toISOString(),
            eventId: event.id,
            read: false
          });
        }
      }
    });
    
    // Add notifications based on user interests
    selectedInterests.forEach(interest => {
      const matchingEvents = events.filter(e => e.interestTags.includes(interest));
      if (matchingEvents.length > 0) {
        const randomEvent = matchingEvents[Math.floor(Math.random() * matchingEvents.length)];
        
        generatedNotifications.push({
          id: `interest-${interest}-${randomEvent.id}`,
          title: `New ${interest} Event`,
          message: `${randomEvent.title} has been added. It might interest you!`,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
          eventId: randomEvent.id,
          read: Math.random() > 0.5
        });
      }
    });
    
    // Add a welcome notification
    generatedNotifications.push({
      id: "welcome",
      title: "Welcome to Roamio",
      message: "Start exploring campus events that match your interests!",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: true
    });
    
    // Sort by timestamp (newest first)
    generatedNotifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setNotifications(generatedNotifications);
  }, [events, rsvpEvents, selectedInterests]);
  
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate to event if it exists
    if (notification.eventId) {
      navigate("/feed");
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - notifTime.getTime()) / 60000);
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold">Notifications</h1>
        <p className="text-sm text-gray-500">Stay updated on campus events</p>
      </div>
      
      <div className="p-4">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Button
                key={notification.id}
                variant="ghost"
                className={`w-full flex items-center justify-between p-4 h-auto ${notification.read ? 'bg-white' : 'bg-roamio-softPurple'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-sm mb-1">{notification.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-400">{getRelativeTime(notification.timestamp)}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No notifications yet</h3>
            <p className="text-gray-500 mt-1">Check back later for updates</p>
          </div>
        )}
      </div>
      
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default Notifications;
