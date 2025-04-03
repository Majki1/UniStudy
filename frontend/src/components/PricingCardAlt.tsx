import zap from "../assets/icons/zap.svg";
import { SubscriptionPlan } from "../types/types";

function PricingCardAlt({
  info,
  showing,
}: {
  info: SubscriptionPlan;
  showing: string;
}) {
  const { tierName, priceAnnually, priceMonthly, features } = info;
  return (
    <div className="flex flex-col items-center justify-center p-5 shadow-lg rounded-xl shadow-secondary-text-color">
      <div className="h-12 w-12 rounded-full bg-gradient-end flex items-center justify-center">
        <img src={zap} alt="Zap" className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-primary-text-color mt-4">
        {tierName}
      </h3>
      <p className="text-lg text-secondary-text-color mt-4">
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
      <button className="bg-gradient-to-b from-gradient-start to-gradient-end text-primary font-semibold py-4 w-full mt-10 rounded-full hover:from-gradient-end hover:to-gradient-start hover:cursor-pointer">
        Get Started
      </button>
    </div>
  );
}

export default PricingCardAlt;
