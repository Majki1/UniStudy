import { useState } from "react";

import PricingCardAlt from "./PricingCardAlt";
import PricingCardMain from "./PricingCardMain";
import { subscriptionPlans } from "../constants/subscription";

function PricingSection() {
  const [showing, setShowing] = useState("monthly");

  return (
    <div className="bg-transparent flex flex-col px-10 items-center justify-center w-full mt-32 mb-12">
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-6xl font-extrabold text-center text-white">
          Simple{" "}
          <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
            Pricing,
          </span>
          <br />{" "}
          <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
            Powerful
          </span>{" "}
          Features
        </h2>
        <p className="text-lg text-center font-medium text-secondary-text-color mt-4">
          Simple, transparent pricing that grows with you. Try any plan free for
          30 days.
        </p>
      </div>
      <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-gradient-start to-gradient-end mt-10 p-2">
        <button
          onClick={() => setShowing("monthly")}
          className={`${
            showing === "monthly" ? "bg-primary" : "bg-transparent"
          } text-white font-semibold text-lg px-6 py-2 rounded-full hover:cursor-pointer`}
        >
          Monthly
        </button>
        <button
          onClick={() => setShowing("annually")}
          className={`${
            showing === "annually" ? "bg-primary" : "bg-transparent"
          } text-white font-semibold text-lg px-6 py-2 rounded-full ml-4 hover:cursor-pointer`}
        >
          Annually
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        <PricingCardAlt info={subscriptionPlans[0]} showing={showing} />
        <PricingCardMain info={subscriptionPlans[1]} showing={showing} />
        <PricingCardAlt info={subscriptionPlans[2]} showing={showing} />
      </div>
    </div>
  );
}

export default PricingSection;
