import { z } from "zod";

const singInValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid Email address" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidation = {
  singInValidationSchema,
  refreshTokenValidationSchema,
};
