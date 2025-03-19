import { SubscriptionPlan } from "../types/types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tierName: "Basic plan",
    priceMonthly: 10,
    priceAnnually: 100,
    features: [
      "1 User",
      "Flexible Plans",
      "Scalability",
      "24/7 Email Support",
      "720 Recording",
      "30 Days Backup",
    ],
  },
  {
    tierName: "Business plan",
    priceMonthly: 20,
    priceAnnually: 200,
    features: [
      "Access to all basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support",
    ],
  },
  {
    tierName: "Enterprise plan",
    priceMonthly: 40,
    priceAnnually: 400,
    features: [
      "Access to all basic features",
      "Basic reporting and analytics",
      "Up to 100 individual users",
      "20GB individual data each user",
      "Chat and email support",
    ],
  },
];
