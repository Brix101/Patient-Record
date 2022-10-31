import { CivilStatus } from "@prisma/client";
import z from "zod";

export const addPatientSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  gender: z.string().nullable(),
  birthday: z.date().nullable(),
  civilStatus: z.nativeEnum(CivilStatus).nullable(),
  religion: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  nationality: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  bloodPressure: z.string().nullable(),
  bloodType: z.string().nullable(),
});

export const searchPatientSchema = z.object({
  name: z.string().optional(),
});

export const deletePatientSchema = z.object({
  id: z.number(),
});

export type AddPatientInput = z.TypeOf<typeof addPatientSchema>;

export type SearchPatientInput = z.TypeOf<typeof searchPatientSchema>;

export type DeletePatientInput = z.TypeOf<typeof deletePatientSchema>;
