import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import onboardingBG from "../assets/images/onboarding-bg.svg";
import grain from "../assets/images/grain.svg";
import FeatureSection from "../components/FeatureSection";
import PricingSection from "../components/PricingSection";
import Footer from "../components/Footer";

function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-between bg-primary">
      <img
        src={onboardingBG}
        alt="Onboarding"
        className="w-[100%] opacity-10 hue-rotate-40 absolute z-0 rotate-[-45]"
      />
      <img src={grain} alt="" className="w-[100%] absolute z-0" />
      <div className="z-10">
        <NavBar authenticated={false} />
        <HeroSection />
        <FeatureSection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
}

export default Onboarding;
