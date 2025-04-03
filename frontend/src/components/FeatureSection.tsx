import { features } from "../constants/features";
import FeatureItem from "./FeatureItem";

function FeatureSection() {
  return (
    <div className="flex flex-col w-full items-center justify-center bg-transparent mt-32 p-4">
      <div className="z-10">
        <h1 className="text-6xl text-center font-bold text-primary-text-color">
          Tailor-made{" "}
          <span className="bg-gradient-to-b from-gradient-start to-gradient-end bg-clip-text text-transparent">
            features
          </span>
        </h1>
        <p className="text-lg font-light text-center text-secondary-text-color mt-4">
          Lorem ipsum is common placeholder text used to demonstrate the graphic
          elements of a document or visual presentation.
        </p>
      </div>
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureItem key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  );
}

export default FeatureSection;
