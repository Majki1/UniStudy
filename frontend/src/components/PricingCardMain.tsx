import zap from "../assets/icons/zap.svg";
import bestValue from "../assets/icons/best_value.svg";
import pricingBg from "../assets/images/pricing-bg.svg";
import { SubscriptionPlan } from "../types/types";

function PricingCardMain({
  info,
  showing,
}: {
  info: SubscriptionPlan;
  showing: string;
}) {
  const { tierName, priceAnnually, priceMonthly, features } = info;
  return (
    <div className="flex h-auto flex-col items-center justify-center p-5 px-10 shadow-lg rounded-xl shadow-secondary-text-color relative mb-12">
      <img
        src={pricingBg}
        alt="Pricing Background"
        className="absolute top-0 left-0 w-full h-full rounded-xl z-0"
      />
      <img
        src={bestValue}
        alt="Best Value"
        className="w-12 h-12 absolute top-2 right-2"
      />
      <div className="h-12 w-12 rounded-full bg-primary-text-color flex items-center justify-center z-10">
        <img src={zap} alt="Zap" className="w-6 h-6" />
      </div>
      <div className="z-10">
        <h3 className="text-xl font-semibold text-center text-primary-text-color mt-4">
          {tierName}
        </h3>
        <p className="text-lg text-center text-secondary-text-color mt-4">
          <span className="font-bold text-primary-text-color text-3xl">
            {showing == "monthly" ? priceMonthly : priceAnnually}$
          </span>{" "}
          {showing}
        </p>
        <ul className="mt-4 self-start">
          {features.map((feature) => (
            <li key={feature} className="text-secondary-text-color my-1">
              • {feature}
            </li>
          ))}
        </ul>
        <button className="bg-primary-text-color text-primary font-semibold py-4 w-full mt-6 rounded-full hover:from-gradient-end hover:to-gradient-start hover:cursor-pointer">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default PricingCardMain;
