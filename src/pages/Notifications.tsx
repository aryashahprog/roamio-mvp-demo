
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/data/mockData";
import { ChevronRight, Bell, Clock, Calendar } from "lucide-react";
import EventNotification from "@/components/EventNotification";
import { motion, AnimatePresence } from "framer-motion";

// Mock notifications based on user interests and RSVPs
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  eventId?: string;
  read: boolean;
  type: 'event' | 'system' | 'reminder';
}

const Notifications = () => {
  const { hasCompletedOnboarding, events, rsvpEvents, selectedInterests } = useAppContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  
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
            read: false,
            type: 'reminder'
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
          read: Math.random() > 0.5,
          type: 'event'
        });
      }
    });
    
    // Add a welcome notification
    generatedNotifications.push({
      id: "welcome",
      title: "Welcome to Roamio",
      message: "Start exploring campus events that match your interests!",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: true,
      type: 'system'
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

  const getNotificationIcon = (type: 'event' | 'system' | 'reminder') => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5 text-roamio-blue" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);
  
  return (
    <div className="min-h-screen pb-32 bg-gray-50">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold">Notifications</h1>
        <p className="text-sm text-gray-500">Stay updated on campus events</p>
        
        {/* Filter tabs */}
        <div className="flex mt-4 border-b border-gray-200">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all' 
              ? 'text-roamio-blue border-b-2 border-roamio-blue' 
              : 'text-gray-500'}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'unread' 
              ? 'text-roamio-blue border-b-2 border-roamio-blue' 
              : 'text-gray-500'}`}
            onClick={() => setActiveFilter('unread')}
          >
            Unread
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-1 bg-roamio-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full flex items-start justify-between p-4 h-auto rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-sm mb-1">{notification.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                        <span className="text-xs text-gray-400">{getRelativeTime(notification.timestamp)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-1.5 ml-2" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-lg shadow-sm mt-4"
            >
              <Bell className="mx-auto h-12 w-12 text-gray-200" />
              <h3 className="text-lg font-medium mt-4">No notifications</h3>
              <p className="text-gray-500 mt-1">
                {activeFilter === 'unread' ? 'No unread notifications' : 'Check back later for updates'}
              </p>
              {activeFilter === 'unread' && notifications.length > 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveFilter('all')}
                >
                  View all notifications
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <EventNotification />
      <Navbar />
    </div>
  );
};

export default Notifications;
