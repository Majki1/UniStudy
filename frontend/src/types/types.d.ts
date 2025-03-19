import { z } from "zod";
import { loginSchema } from "../schemas/auth-schemas";

export type LoginFormInputs = z.infer<typeof loginSchema>;

export type Feature = {
  title: string;
  description: string;
};

export type SubscriptionPlan = {
  tierName: string;
  priceMonthly: number;
  priceAnnually: number;
  features: string[];
};
