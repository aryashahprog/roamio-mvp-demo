
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
      <InterestSelector />
    </div>
  );
};

export default Onboarding;
