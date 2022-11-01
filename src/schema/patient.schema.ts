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
  birthday: z.date().optional(),
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

export const deletePatientSchema = z.object({
  id: z.number(),
});

export type AddPatientInput = z.TypeOf<typeof addPatientSchema>;

export type UpdatePatientInput = z.TypeOf<typeof updatePatientSchema>;

export type SearchPatientInput = z.TypeOf<typeof searchPatientSchema>;

export type DeletePatientInput = z.TypeOf<typeof deletePatientSchema>;
