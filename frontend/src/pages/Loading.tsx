import { images } from "../constants/images";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-primary">
      <img
        src={images.rays}
        alt="Background rays"
        className="absolute z-0 w-full h-full min-h-screen object-cover opacity-30"
      />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <DotLottieReact
          src="https://lottie.host/727a1775-a420-4c81-8bbe-d2115914eb86/MTPoMPsXxq.lottie"
          loop
          autoplay
          className="w-1/2 h-1/2 mb-4 z-10"
        />
        <h1 className="text-3xl font-bold mb-4 text-primary-text-color z-10">
          Crafting your course...
        </h1>
        <p className="text-lg text-secondary-text-color z-10">
          This may take a few minutees, please be patient.
        </p>
        <div className="flex flex-row w-1/2 items-start justify-start mt-4">
          <img
            src={images.wizardGlasses}
            alt="Wizard with glasses"
            className="z-10"
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
