
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import ProfileForm from "@/components/ProfileForm";
import MyEvents from "@/components/MyEvents";
import RecommendedEvents from "@/components/RecommendedEvents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Heart, Instagram, Linkedin, Bell, MessageSquare, Smile } from "lucide-react";
import InterestSelector from "@/components/InterestSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { hasCompletedOnboarding, userProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [greeting, setGreeting] = useState<string>("");
  
  // Redirect to onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  // Set greeting based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours();
    let timeGreeting = "Hello";
    
    if (currentHour < 12) {
      timeGreeting = "Good morning";
    } else if (currentHour < 17) {
      timeGreeting = "Good afternoon";
    } else {
      timeGreeting = "Good evening";
    }
    
    const name = userProfile.name ? `, ${userProfile.name.split(" ")[0]}` : "";
    setGreeting(`${timeGreeting}${name}!`);
  }, [userProfile.name]);
  
  return (
    <div className="min-h-screen pb-32 bg-gray-50">
      <div className="bg-roamio-blue text-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold">{greeting}</h1>
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
              <Heart size={16} />
              <span>Interests</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
            
            {/* Recommendations section */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-3">Recommended For You</h3>
              <p className="text-gray-500 text-sm mb-4">Based on your interests and past activities</p>
              <RecommendedEvents />
            </div>
            
            {/* Settings section */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-md font-medium mb-3">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="event-alerts">Event Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified about events near you</p>
                  </div>
                  <Switch id="event-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rsvp-reminders">RSVP Reminders</Label>
                    <p className="text-xs text-gray-500">Reminders for events you're attending</p>
                  </div>
                  <Switch id="rsvp-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-events">New Recommendations</Label>
                    <p className="text-xs text-gray-500">Notifications about recommended events</p>
                  </div>
                  <Switch id="new-events" />
                </div>
              </div>
            </div>
            
            {/* Social links */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-md font-medium mb-3">Social Media</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href={userProfile.socialLink?.platform === 'instagram' ? userProfile.socialLink.url : 'https://instagram.com'}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-gray-700 hover:text-roamio-blue transition-colors"
                >
                  <Instagram size={16} className="mr-2" />
                  <span>Connect Instagram</span>
                </a>
                <a 
                  href={userProfile.socialLink?.platform === 'linkedin' ? userProfile.socialLink.url : 'https://linkedin.com'}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-gray-700 hover:text-roamio-blue transition-colors"
                >
                  <Linkedin size={16} className="mr-2" />
                  <span>Connect LinkedIn</span>
                </a>
              </div>
            </div>
            
            {/* Contact section - moved from footer */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-md font-medium mb-3">Help & Support</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="#" 
                  className="flex items-center text-sm text-gray-700 hover:text-roamio-blue transition-colors"
                >
                  <MessageSquare size={16} className="mr-2" />
                  <span>Contact Us</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-sm text-gray-700 hover:text-roamio-blue transition-colors"
                >
                  <Smile size={16} className="mr-2" />
                  <span>Send Feedback</span>
                </a>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <MyEvents />
          </TabsContent>

          <TabsContent value="interests">
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
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
