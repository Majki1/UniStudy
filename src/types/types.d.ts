import { z } from "zod";
import { loginSchema } from "../schemas/auth-schemas";

export type LoginFormInputs = z.infer<typeof loginSchema>;
