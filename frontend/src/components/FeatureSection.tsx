import { features } from "../constants/features";
import FeatureItem from "./FeatureItem";

function FeatureSection() {
  return (
    <div className="flex flex-col w-full items-center justify-center bg-transparent p-4">
      <div className="z-10">
        <h1 className="text-4xl text-center font-bold text-primary-text-color">
          Tailor-made{" "}
          <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
            features
          </span>
        </h1>
        <p className="text-lg text-center text-secondary-text-color mt-4">
          Lorem ipsum is common placeholder text used to demonstrate the graphic
          elements of a document or visual presentation.
        </p>
      </div>
      <div className="flex flex-row items-center justify-center mt-20 space-x-8">
        {features.map((feature) => (
          <FeatureItem key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  );
}

export default FeatureSection;
