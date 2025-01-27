import { z } from "zod";

export const passwordLengthAndNoSpacesSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .regex(/^\S*$/, "Password must not contain spaces");

export const passwordUppercaseSchema = z
  .string()
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter");

export const passwordDigitSchema = z
  .string()
  .regex(/\d/, "Password must contain at least one digit");

export const signUpSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string().min(3).max(255),
    password:
      passwordLengthAndNoSpacesSchema &&
      passwordUppercaseSchema &&
      passwordDigitSchema,
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });
