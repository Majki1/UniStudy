import { Feature } from "../types/types";

function FeatureItem({ feature }: { feature: Feature }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="https://source.unsplash.com/random/200x200"
        alt="Feature 3"
        className="w-8 h-8 rounded-full"
      />
      <h3 className="text-xl font-semibold text-primary-text-color mt-4">
        {feature.title}
      </h3>
      <p className="text-secondary-text-color text-center mt-2">
        {feature.description}
      </p>
    </div>
  );
}

export default FeatureItem;
