
import InterestSelector from "@/components/InterestSelector";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";

const Onboarding = () => {
  const { hasCompletedOnboarding } = useAppContext();
  
  // Redirect to feed if user already completed onboarding
  if (hasCompletedOnboarding) {
    return <Navigate to="/feed" replace />;
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex justify-center">
        <img 
          src="public/lovable-uploads/0f928ca1-0968-43e3-a4ad-043a41833db4.png" 
          alt="Roamio Logo" 
          className="h-10 object-contain" 
        />
      </div>
      <InterestSelector />
    </div>
  );
};

export default Onboarding;
