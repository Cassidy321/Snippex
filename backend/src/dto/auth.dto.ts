import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, "A minimum of 2 characters is required")
    .max(30, "A maximum of 30 characters is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must containt only alphanumeric characters"),
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "The password should contain at least 8 characters")
    .max(255, "The password cannot exceed 255 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "The password is required"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
