import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import onboardingBG from "../assets/images/onboarding-bg.svg";
import grain from "../assets/images/grain.svg";
import FeatureSection from "../components/FeatureSection";

function Onboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Optionally, persist the onboarding status (e.g., localStorage.setItem('hasOnboarded', 'true'))
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-between bg-primary p-4">
      <img
        src={onboardingBG}
        alt="Onboarding"
        className="w-[100%] opacity-10 hue-rotate-40 absolute z-0 rotate-[-45]"
      />
      <img src={grain} alt="" className="w-[100%] absolute z-0" />
      <div className="z-10">
        <NavBar />
        <HeroSection />
        <FeatureSection />
      </div>
    </div>
  );
}

export default Onboarding;
