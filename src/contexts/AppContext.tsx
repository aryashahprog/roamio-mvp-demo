import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { mockEvents, Event, Interest } from "../data/mockData";
import { toast } from "@/components/ui/sonner";

// New interface for user profile data
interface UserProfile {
  name: string;
  year: string;
  major: string;
  profilePicture: string;
  socialLink?: {
    platform: 'instagram' | 'linkedin';
    url: string;
  };
}

interface AppContextType {
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: (completed: boolean) => void;
  selectedInterests: Interest[];
  toggleInterest: (interest: Interest) => void;
  events: Event[];
  filteredEvents: Event[];
  setFilteredEvents: (events: Event[]) => void;
  rsvpEvents: Record<string, boolean>;
  toggleRSVP: (eventId: string) => void;
  checkedInEvents: Record<string, string>;
  checkInToEvent: (eventId: string) => void;
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
  notificationEvent: Event | null;
  setNotificationEvent: (event: Event | null) => void;
  // User profile properties
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  // Bookmarks
  bookmarkedEvents: string[];
  bookmarkEvent: (eventId: string) => void;
  // Recommendations
  recommendedEvents: Event[];
  // Event reminders
  eventReminders: string[];
  toggleEventReminder: (eventId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Check if user completed onboarding
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const saved = localStorage.getItem("hasCompletedOnboarding");
    return saved ? JSON.parse(saved) : false;
  });

  // User selected interests
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(() => {
    const saved = localStorage.getItem("selectedInterests");
    return saved ? JSON.parse(saved) : [];
  });

  // Events state
  const [events] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);

  // RSVP state
  const [rsvpEvents, setRsvpEvents] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("rsvpEvents");
    return saved ? JSON.parse(saved) : {};
  });

  // Check-in state
  const [checkedInEvents, setCheckedInEvents] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("checkedInEvents");
    return saved ? JSON.parse(saved) : {};
  });

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationEvent, setNotificationEvent] = useState<Event | null>(null);

  // Bookmarks state
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem("bookmarkedEvents");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Event reminders state
  const [eventReminders, setEventReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem("eventReminders");
    return saved ? JSON.parse(saved) : [];
  });

  // Recommended events
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);

  // Add user profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : {
      name: "",
      year: "",
      major: "",
      profilePicture: "/placeholder.svg",
    };
  });

  // Set completed onboarding
  const setOnboardingComplete = (completed: boolean) => {
    setHasCompletedOnboarding(completed);
    localStorage.setItem("hasCompletedOnboarding", JSON.stringify(completed));
  };

  // Toggle interest selection
  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) => {
      const isSelected = prev.includes(interest);
      
      // If already selected, remove it
      if (isSelected) {
        const updated = prev.filter(i => i !== interest);
        localStorage.setItem("selectedInterests", JSON.stringify(updated));
        return updated;
      }
      
      // Otherwise add it
      const updated = [...prev, interest];
      localStorage.setItem("selectedInterests", JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle RSVP status
  const toggleRSVP = (eventId: string) => {
    setRsvpEvents((prev) => {
      const updated = { ...prev, [eventId]: !prev[eventId] };
      localStorage.setItem("rsvpEvents", JSON.stringify(updated));
      
      // Show toast confirmation
      if (!prev[eventId]) {
        toast("You've RSVP'd to this event!", {
          description: "You'll receive a notification before it starts."
        });
      }
      
      return updated;
    });
  };

  // Check-in to event
  const checkInToEvent = (eventId: string) => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    
    setCheckedInEvents((prev) => {
      const updated = { ...prev, [eventId]: timestamp };
      localStorage.setItem("checkedInEvents", JSON.stringify(updated));
      return updated;
    });
    
    toast.success("Check-in successful!", {
      description: `You checked in on ${new Date().toLocaleTimeString()}`
    });
  };

  // Toggle bookmark for an event
  const bookmarkEvent = (eventId: string) => {
    setBookmarkedEvents((prev) => {
      const isBookmarked = prev.includes(eventId);
      let updated;
      
      if (isBookmarked) {
        updated = prev.filter(id => id !== eventId);
      } else {
        updated = [...prev, eventId];
      }
      
      localStorage.setItem("bookmarkedEvents", JSON.stringify(updated));
      return updated;
    });
  };
  
  // Toggle event reminder
  const toggleEventReminder = (eventId: string) => {
    setEventReminders((prev) => {
      const isReminded = prev.includes(eventId);
      let updated;
      
      if (isReminded) {
        updated = prev.filter(id => id !== eventId);
      } else {
        updated = [...prev, eventId];
      }
      
      localStorage.setItem("eventReminders", JSON.stringify(updated));
      return updated;
    });
  };

  // Add update profile function
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile };
      localStorage.setItem("userProfile", JSON.stringify(updated));
      return updated;
    });
    
    toast.success("Profile updated successfully!");
  };

  // Generate recommended events based on interests and past interactions
  useEffect(() => {
    if (selectedInterests.length > 0 || Object.keys(rsvpEvents).length > 0) {
      // Get events that match user interests but aren't already RSVP'd to
      const interestBasedEvents = events.filter(event => 
        event.interestTags.some(tag => selectedInterests.includes(tag)) && 
        !rsvpEvents[event.id]
      );
      
      // Get similar events to those user has RSVP'd to
      const rsvpEventIds = Object.entries(rsvpEvents)
        .filter(([_, value]) => value)
        .map(([id]) => id);
      
      const rsvpedEvents = events.filter(event => rsvpEventIds.includes(event.id));
      
      const relatedTags = new Set<Interest>();
      rsvpedEvents.forEach(event => {
        event.interestTags.forEach(tag => relatedTags.add(tag));
      });
      
      const similarEvents = events.filter(event => 
        !rsvpEventIds.includes(event.id) && 
        event.interestTags.some(tag => relatedTags.has(tag))
      );
      
      // Combine and remove duplicates
      const combined = [...interestBasedEvents, ...similarEvents];
      const uniqueRecommended = Array.from(
        new Map(combined.map(event => [event.id, event])).values()
      ).slice(0, 3); // Limit to 3 recommendations
      
      setRecommendedEvents(uniqueRecommended);
    }
  }, [selectedInterests, rsvpEvents, events]);

  // Mock a random notification for nearby event
  useEffect(() => {
    if (hasCompletedOnboarding && events.length > 0) {
      const randomTimeout = Math.floor(Math.random() * 15000) + 10000; // 10-25 seconds
      
      const notificationTimer = setTimeout(() => {
        // Pick a random event for notification
        const nearbyEvent = events[Math.floor(Math.random() * events.length)];
        setNotificationEvent(nearbyEvent);
        setShowNotification(true);
      }, randomTimeout);
      
      return () => clearTimeout(notificationTimer);
    }
  }, [hasCompletedOnboarding, events]);

  // Filter events when interests change
  useEffect(() => {
    if (selectedInterests.length === 0) {
      setFilteredEvents(events); // Show all events if no interests selected
    } else {
      const filtered = events.filter(event => 
        event.interestTags.some(tag => selectedInterests.includes(tag))
      );
      setFilteredEvents(filtered);
    }
  }, [selectedInterests, events]);

  const value = {
    hasCompletedOnboarding,
    setOnboardingComplete,
    selectedInterests,
    toggleInterest,
    events,
    filteredEvents,
    setFilteredEvents,
    rsvpEvents,
    toggleRSVP,
    checkedInEvents,
    checkInToEvent,
    showNotification,
    setShowNotification,
    notificationEvent,
    setNotificationEvent,
    userProfile,
    updateUserProfile,
    bookmarkedEvents,
    bookmarkEvent,
    recommendedEvents,
    eventReminders,
    toggleEventReminder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
