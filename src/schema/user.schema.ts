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
  expertise: z.string().nullable(),
  licenseNumber: z.string().nullable(),
});

export const createUserOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  image: z.string(),
});

export const searchUserSchema = z.object({
  name: z.string(),
});

export const updateUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  image: z.string().nullable(),
  gender: z.string(),
  birthday: z.date(),
  address: z.string().nullable(),
  mobile: z.string().nullable(),
  physicianId: z.number(),
  expertise: z.string().nullable(),
  licenseNumber: z.string().nullable(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export type SearchUserInput = z.TypeOf<typeof searchUserSchema>;

export type UpdateUserInput = z.TypeOf<Omit<typeof updateUserSchema, "id">>;
