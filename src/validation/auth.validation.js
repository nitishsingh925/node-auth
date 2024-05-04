import { z } from "zod";

export const signupValidator = z.object({
  // username
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9]+$/),
  // email
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email()
    .max(100),
  // password
  password: z
    .string({ required_error: "password  is required" })
    .min(6)
    .max(100),
});

export const signinValidator = z.object({
  // username
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9]+$/)
    .optional(),
  // email
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email()
    .max(100)
    .optional(),
  // password
  password: z
    .string({ required_error: "password  is required" })
    .min(6)
    .max(100),
});
