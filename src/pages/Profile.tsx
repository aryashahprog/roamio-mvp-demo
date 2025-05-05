
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import ProfileForm from "@/components/ProfileForm";
import MyEvents from "@/components/MyEvents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar } from "lucide-react";
import InterestSelector from "@/components/InterestSelector";

const Profile = () => {
  const { hasCompletedOnboarding } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <div className="bg-roamio-blue text-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold">My Profile</h1>
        <p className="text-sm text-white/80">Manage your information & events</p>
      </div>
      
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>My Events</span>
            </TabsTrigger>
            <TabsTrigger value="interests" className="flex items-center gap-2">
              <span>🎯</span>
              <span>Interests</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="events">
            <MyEvents />
          </TabsContent>

          <TabsContent value="interests">
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">Update Your Interests</h3>
              <p className="text-gray-600 text-sm mb-4">
                Select the types of events you're interested in
              </p>
              <InterestSelector compact />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Profile;
