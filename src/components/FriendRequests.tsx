
import { useAppContext } from "@/contexts/AppContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, UserPlus } from "lucide-react";

const FriendRequests = () => {
  const { 
    friendRequests, 
    acceptFriendRequest, 
    rejectFriendRequest,
    getSuggestedFriends,
    sendFriendRequest 
  } = useAppContext();

  const pendingRequests = friendRequests.filter(request => request.status === 'pending');
  const suggestedFriends = getSuggestedFriends();

  return (
    <div className="space-y-6">
      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Friend Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.fromUserPicture} />
                    <AvatarFallback>
                      {request.fromUserName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{request.fromUserName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => acceptFriendRequest(request.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectFriendRequest(request.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Suggested Friends */}
      {suggestedFriends.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">People You May Know</h3>
          <div className="space-y-3">
            {suggestedFriends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendFriendRequest(friend.id, friend.name, friend.profilePicture)}
                  className="text-roamio-blue border-roamio-blue hover:bg-roamio-blue hover:text-white"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FriendRequests;
