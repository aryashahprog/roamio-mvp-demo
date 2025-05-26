
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
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Roamio</h1>
        <p className="text-sm text-gray-500">Let's get started with your interests</p>
      </div>
      <InterestSelector />
    </div>
  );
};

export default Onboarding;
