import z from "zod";

export const requestOtpSchema = z.object({
  email: z.string().email(),
});

export type RequestOtpInput = z.TypeOf<typeof requestOtpSchema>;

export const confirmOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  hash: z.string(),
});

export type ConfirmOtpInput = z.TypeOf<typeof confirmOtpSchema>;

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
