import { object, string } from "zod";

import { z } from "zod";

const getEmailSchema = () =>
  string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");

export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  string({ required_error: `${type} is required` })
    .min(8, `${type} must be atleast 8 characters`)
    .max(32, `${type} can not exceed 32 characters`);

export const resetPasswordSchema = object({
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// export const ForgotPasswordSchema = z.object({
//   email: z
//     .string() // string type
//     .email({ message: "Invalid type" }) // checks if the input given by the user is email
//     .min(1, { message: "Email is required" }), // checks if the email field is empty or not
// });

// export const ResetPasswordSchema = z
//   .object({
//     password: z
//       .string() // check if it is string type
//       .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
//       .max(20, { message: "Password must be at most 20 characters long" }),
//     confirmPassword: z
//       .string()
//       .min(8, { message: "Password must be at least 8 characters long" })
//       .max(20, { message: "Password must be at most 20 characters long" }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],

//     // checks if the password and confirm password are equal
//   });
