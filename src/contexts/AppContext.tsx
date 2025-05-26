
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

// Friend request interfaces
interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPicture: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  year: string;
  major: string;
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
  // Friend requests
  friendRequests: FriendRequest[];
  friends: Friend[];
  sendFriendRequest: (toUserId: string, toUserName: string, toUserPicture: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  getSuggestedFriends: () => Friend[];
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

  // Friend requests state
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const saved = localStorage.getItem("friendRequests");
    return saved ? JSON.parse(saved) : [];
  });

  // Friends state
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem("friends");
    return saved ? JSON.parse(saved) : [];
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

  // Send friend request
  const sendFriendRequest = (toUserId: string, toUserName: string, toUserPicture: string) => {
    const newRequest: FriendRequest = {
      id: `req_${Date.now()}`,
      fromUserId: "current_user",
      fromUserName: userProfile.name || "You",
      fromUserPicture: userProfile.profilePicture,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setFriendRequests((prev) => {
      const updated = [...prev, newRequest];
      localStorage.setItem("friendRequests", JSON.stringify(updated));
      return updated;
    });

    toast.success(`Friend request sent to ${toUserName}!`);
  };

  // Accept friend request
  const acceptFriendRequest = (requestId: string) => {
    setFriendRequests((prev) => {
      const request = prev.find(r => r.id === requestId);
      if (!request) return prev;

      // Add to friends list
      const newFriend: Friend = {
        id: request.fromUserId,
        name: request.fromUserName,
        profilePicture: request.fromUserPicture,
        year: "Junior", // Mock data
        major: "Computer Science" // Mock data
      };

      setFriends((prevFriends) => {
        const updated = [...prevFriends, newFriend];
        localStorage.setItem("friends", JSON.stringify(updated));
        return updated;
      });

      // Update request status
      const updated = prev.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' as const } : r
      );
      localStorage.setItem("friendRequests", JSON.stringify(updated));
      
      toast.success(`You're now friends with ${request.fromUserName}!`);
      return updated;
    });
  };

  // Reject friend request
  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests((prev) => {
      const updated = prev.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' as const } : r
      );
      localStorage.setItem("friendRequests", JSON.stringify(updated));
      return updated;
    });

    toast("Friend request declined");
  };

  // Get suggested friends (mock data)
  const getSuggestedFriends = (): Friend[] => {
    const mockSuggestions: Friend[] = [
      {
        id: "user_1",
        name: "Sarah Chen",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
        year: "Sophomore",
        major: "Biology"
      },
      {
        id: "user_2", 
        name: "Mike Johnson",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        year: "Junior",
        major: "Engineering"
      },
      {
        id: "user_3",
        name: "Emma Wilson",
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        year: "Senior",
        major: "Psychology"
      }
    ];

    // Filter out existing friends and pending requests
    const friendIds = friends.map(f => f.id);
    const pendingRequestIds = friendRequests
      .filter(r => r.status === 'pending')
      .map(r => r.toUserId);

    return mockSuggestions.filter(suggestion => 
      !friendIds.includes(suggestion.id) && 
      !pendingRequestIds.includes(suggestion.id)
    );
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
    toggleEventReminder,
    friendRequests,
    friends,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getSuggestedFriends
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
