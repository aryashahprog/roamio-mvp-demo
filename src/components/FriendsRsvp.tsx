
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

interface FriendsRsvpProps {
  eventId: string;
  className?: string;
}

const FriendsRsvp = ({ eventId, className = "" }: FriendsRsvpProps) => {
  const { friends, rsvpEvents } = useAppContext();
  
  // Get friends who have RSVP'd to this event
  const getFriendsRsvped = (eventId: string): Friend[] => {
    // For demo purposes, randomly assign some friends as having RSVP'd
    if (friends.length === 0) return [];
    
    const friendsCount = Math.min(friends.length, Math.floor(Math.random() * 3) + 1);
    return friends.slice(0, friendsCount).map(friend => ({
      id: friend.id,
      name: friend.name,
      avatar: friend.profilePicture
    }));
  };

  const friendsRsvped = getFriendsRsvped(eventId);

  if (friendsRsvped.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Users className="h-4 w-4 text-gray-500 mr-2" />
      <div className="flex -space-x-1">
        {friendsRsvped.slice(0, 3).map((friend) => (
          <Avatar key={friend.id} className="w-6 h-6 border-2 border-white">
            <AvatarFallback className="text-xs bg-roamio-blue text-white">
              {friend.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        ))}
        {friendsRsvped.length > 3 && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs border-2 border-white">
            +{friendsRsvped.length - 3}
          </div>
        )}
      </div>
      <span className="text-xs text-gray-600 ml-2">
        {friendsRsvped.length === 1 
          ? `${friendsRsvped[0].name.split(' ')[0]} is going`
          : `${friendsRsvped.length} friends going`
        }
      </span>
    </div>
  );
};

export default FriendsRsvp;
