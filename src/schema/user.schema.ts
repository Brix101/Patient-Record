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
  sessionCharge: z.number().nullable(),
});

export const createUserOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  image: z.string(),
});

export const searchUserSchema = z.object({
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
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
  expertise: z.string().nullable(),
  licenseNumber: z.string().nullable(),
  sessionCharge: z.number().nullable(),
});

export const deleteUserSchema = z.object({
  id: z.number(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export type SearchUserInput = z.TypeOf<typeof searchUserSchema>;

export type UpdateUserInput = z.TypeOf<Omit<typeof updateUserSchema, "id">>;

export type DeleteUserInput = z.TypeOf<typeof deleteUserSchema>;

export type ChangePasswordInput = z.TypeOf<typeof changePasswordSchema>;
