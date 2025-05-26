
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";

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
  // Mock friends data - in a real app, this would come from an API
  const getFriendsRsvped = (eventId: string): Friend[] => {
    const allFriends = [
      { id: "1", name: "Sarah Chen" },
      { id: "2", name: "Mike Johnson" },
      { id: "3", name: "Emma Wilson" },
      { id: "4", name: "Alex Rodriguez" },
      { id: "5", name: "Jenna Kim" },
    ];
    
    // Randomly assign friends to events for demo
    const friendsCount = Math.floor(Math.random() * 4) + 1;
    return allFriends.slice(0, friendsCount);
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
