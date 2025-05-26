
import { useAppContext } from "@/contexts/AppContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

const FriendsList = () => {
  const { friends } = useAppContext();

  if (friends.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="font-medium text-gray-900 mb-1">No friends yet</h3>
        <p className="text-sm text-gray-500">
          Add friends to see who's going to events
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center">
        <Users className="h-4 w-4 mr-2" />
        My Friends ({friends.length})
      </h3>
      <div className="space-y-3">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={friend.profilePicture} />
              <AvatarFallback>
                {friend.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{friend.name}</p>
              <p className="text-xs text-gray-500">
                {friend.year} • {friend.major}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FriendsList;
