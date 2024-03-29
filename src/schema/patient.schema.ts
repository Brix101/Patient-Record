import { CivilStatus } from "@prisma/client";
import z from "zod";

export const addPatientSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  gender: z.string().optional(),
  birthday: z.date().optional(),
  civilStatus: z.nativeEnum(CivilStatus).optional(),
  religion: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  nationality: z.string().optional(),
  bloodType: z.string().optional(),
});

export const updatePatientSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  gender: z.string().optional(),
  birthday: z.date().nullish(),
  civilStatus: z.nativeEnum(CivilStatus).optional(),
  religion: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  nationality: z.string().optional(),
  bloodType: z.string().optional(),
});

export const searchPatientSchema = z.object({
  name: z.string().optional(),
});

export const getPatientSchema = z.object({
  id: z.number(),
});

export const deletePatientSchema = z.object({
  id: z.number(),
});

export const registerPatientUserSchema = z.object({
  patiendId: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export type AddPatientInput = z.TypeOf<typeof addPatientSchema>;

export type UpdatePatientInput = z.TypeOf<typeof updatePatientSchema>;

export type SearchPatientInput = z.TypeOf<typeof searchPatientSchema>;

export type GetPatientInput = z.TypeOf<typeof getPatientSchema>;

export type DeletePatientInput = z.TypeOf<typeof deletePatientSchema>;

export type RegisterPatientUserInput = z.TypeOf<
  typeof registerPatientUserSchema
>;
