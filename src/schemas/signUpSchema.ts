import { z } from "zod";

export const userNameValidator = z
  .string()
  .min(4, "minimum 4 characters are required in username")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  // username: userNameValidator,
  name: z.string().min(3, "name can't be less than 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "minimum 8 characters are required in password"),
});
