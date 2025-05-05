export type Interest = 
  | "Free Food" 
  | "Career Events" 
  | "Wellness" 
  | "Club Fairs" 
  | "Music" 
  | "Academic";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    building: string;
    room: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  date: string;
  startTime: string;
  endTime: string;
  interestTags: Interest[];
  image?: string;
}

// Mock events data
export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Tech Career Mixer",
    description: "Network with tech companies looking to hire interns and full-time employees. Free pizza and refreshments provided!",
    location: {
      building: "Computer Science Building",
      room: "Room 101",
      coordinates: {
        x: 150,
        y: 120
      }
    },
    date: "2025-05-06",
    startTime: "16:30",
    endTime: "19:00",
    interestTags: ["Career Events", "Free Food"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: "event-2",
    title: "Yoga on the Quad",
    description: "Join us for a relaxing yoga session on the main quad. All levels welcome! Mats provided.",
    location: {
      building: "Main Quad",
      room: "West Side",
      coordinates: {
        x: 200,
        y: 220
      }
    },
    date: "2025-05-05",
    startTime: "08:00",
    endTime: "09:00",
    interestTags: ["Wellness"],
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
  },
  {
    id: "event-3",
    title: "Spring Club Fair",
    description: "Discover new clubs and organizations to join this spring semester. Over 50+ clubs represented!",
    location: {
      building: "Student Union",
      room: "Grand Ballroom",
      coordinates: {
        x: 320,
        y: 180
      }
    },
    date: "2025-05-07",
    startTime: "12:00",
    endTime: "15:00",
    interestTags: ["Club Fairs", "Free Food"],
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: "event-4",
    title: "Guest Lecture: AI Ethics",
    description: "Distinguished speaker from Google discussing the ethical implications of AI in society.",
    location: {
      building: "Engineering Hall",
      room: "Auditorium 2",
      coordinates: {
        x: 100,
        y: 300
      }
    },
    date: "2025-05-08",
    startTime: "14:00",
    endTime: "16:00",
    interestTags: ["Academic", "Career Events"],
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
  },
  {
    id: "event-5",
    title: "Student Concert Series",
    description: "Performances by student musical groups featuring jazz, a cappella, and indie rock.",
    location: {
      building: "Arts Center",
      room: "Main Stage",
      coordinates: {
        x: 420,
        y: 120
      }
    },
    date: "2025-05-09",
    startTime: "19:00",
    endTime: "21:30",
    interestTags: ["Music"],
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
  },
  {
    id: "event-6",
    title: "Free Breakfast Bar",
    description: "Start your day right with a complimentary breakfast sponsored by the Student Affairs Office.",
    location: {
      building: "Library Commons",
      room: "1st Floor",
      coordinates: {
        x: 250,
        y: 150
      }
    },
    date: "2025-05-06",
    startTime: "08:00",
    endTime: "10:00",
    interestTags: ["Free Food"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  },
  {
    id: "event-7",
    title: "Mindfulness Meditation Session",
    description: "Learn stress-reduction techniques through guided meditation practices.",
    location: {
      building: "Wellness Center",
      room: "Room 205",
      coordinates: {
        x: 380,
        y: 220
      }
    },
    date: "2025-05-10",
    startTime: "17:00",
    endTime: "18:00",
    interestTags: ["Wellness"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  }
];

export const interestOptions: Interest[] = [
  "Free Food",
  "Career Events",
  "Wellness",
  "Club Fairs",
  "Music",
  "Academic"
];

// Function to get appropriate CSS class for interest tag
export const getInterestTagClass = (interest: Interest): string => {
  switch(interest) {
    case "Free Food":
      return "interest-tag-food";
    case "Career Events":
      return "interest-tag-career";
    case "Wellness":
      return "interest-tag-wellness";
    case "Club Fairs":
      return "interest-tag-club";
    case "Music":
      return "interest-tag-music";
    case "Academic":
      return "interest-tag-academic";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Function for human-readable date formatting
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Function to format time
export const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
