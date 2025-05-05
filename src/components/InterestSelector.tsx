
import { Button } from "@/components/ui/button";
import { Interest, interestOptions, getInterestTagClass } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterestSelector = () => {
  const { selectedInterests, toggleInterest, setOnboardingComplete } = useAppContext();
  const navigate = useNavigate();

  const handleCompleteOnboarding = () => {
    if (selectedInterests.length > 0) {
      setOnboardingComplete(true);
      navigate("/feed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome to Roamio</h1>
        <p className="text-gray-600">Select your interests to personalize your event feed</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {interestOptions.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`
              h-32 rounded-xl flex flex-col items-center justify-center p-4 border-2 transition-all duration-200 
              ${
                selectedInterests.includes(interest)
                  ? `border-roamio-purple bg-roamio-softPurple text-roamio-darkPurple`
                  : `border-gray-200 bg-white text-gray-700 hover:bg-gray-50`
              }
            `}
          >
            <div 
              className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${getInterestTagClass(interest)}`}
            >
              {interest === "Free Food" && "🍕"}
              {interest === "Career Events" && "💼"}
              {interest === "Wellness" && "🧘"}
              {interest === "Club Fairs" && "🎉"}
              {interest === "Music" && "🎵"}
              {interest === "Academic" && "📚"}
            </div>
            <span className="text-sm font-medium text-center">{interest}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <Button 
          onClick={handleCompleteOnboarding}
          disabled={selectedInterests.length === 0} 
          className="w-full py-6 text-lg"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default InterestSelector;
