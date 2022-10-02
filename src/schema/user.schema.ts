import { Role } from "@prisma/client";
import z from "zod";

export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  image: z.string().nullable(),
  gender: z.string(),
  birthday: z.date(),
  address: z.string().nullable(),
  mobile: z.string().nullable(),
  expertes: z.string().nullable(),
  licenseNUmber: z.string().nullable(),
});

export const createUserOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  image: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

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

export const searchUserSchema = z.object({
  name: z.string(),
});

export type SearchUserInput = z.TypeOf<typeof searchUserSchema>;
