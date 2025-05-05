
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Instagram, Linkedin } from "lucide-react";

const yearOptions = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

interface ProfileFormValues {
  name: string;
  year: string;
  major: string;
  socialPlatform: "instagram" | "linkedin";
  socialLink: string;
}

const ProfileForm = () => {
  const { userProfile, updateUserProfile } = useAppContext();
  const [socialPlatform, setSocialPlatform] = useState<"instagram" | "linkedin">(
    userProfile.socialLink?.platform || "instagram"
  );
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: userProfile.name || "",
      year: userProfile.year || "",
      major: userProfile.major || "",
      socialPlatform: userProfile.socialLink?.platform || "instagram",
      socialLink: userProfile.socialLink?.url || ""
    }
  });
  
  const onSubmit = (data: ProfileFormValues) => {
    updateUserProfile({
      name: data.name,
      year: data.year,
      major: data.major,
      socialLink: data.socialLink ? {
        platform: socialPlatform,
        url: data.socialLink
      } : undefined
    });
  };

  // Mock profile pictures
  const profilePicOptions = [
    "/placeholder.svg",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop"
  ];

  const [profilePicture, setProfilePicture] = useState(userProfile.profilePicture || profilePicOptions[0]);

  const handleProfilePictureChange = (pic: string) => {
    setProfilePicture(pic);
    updateUserProfile({ profilePicture: pic });
  };
  
  return (
    <div className="bg-white rounded-lg p-4 space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarImage src={profilePicture} alt="Profile" />
          <AvatarFallback>
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex gap-2 flex-wrap justify-center">
          {profilePicOptions.map((pic) => (
            <button
              key={pic}
              onClick={() => handleProfilePictureChange(pic)}
              className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                profilePicture === pic ? "border-roamio-blue scale-110" : "border-gray-200"
              }`}
            >
              <img src={pic} alt="Profile option" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                    {...field}
                  >
                    <option value="" disabled>Select year</option>
                    {yearOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input placeholder="Your major" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <Label className="font-medium">Social Media (Optional)</Label>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant={socialPlatform === "instagram" ? "default" : "outline"} 
                className="w-1/2"
                onClick={() => setSocialPlatform("instagram")}
              >
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Button>
              <Button 
                type="button" 
                variant={socialPlatform === "linkedin" ? "default" : "outline"} 
                className="w-1/2"
                onClick={() => setSocialPlatform("linkedin")}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>
            <FormField
              control={form.control}
              name="socialLink"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder={socialPlatform === "instagram" ? "@username" : "linkedin.com/in/username"}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-roamio-blue hover:bg-roamio-darkBlue"
          >
            Save Profile
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
