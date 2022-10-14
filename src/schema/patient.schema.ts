import { CivilStatus } from "@prisma/client";
import z from "zod";

export const addPatientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string().nullable(),
  birthday: z.date().nullable(),
  civilStatus: z.nativeEnum(CivilStatus).nullable(),
  religion: z.string().nullable(),
  mobile: z.string().nullable(),
  address: z.string().nullable(),
  nationality: z.string().nullable(),
  weight: z.string().nullable(),
  height: z.string().nullable(),
  bloodPressure: z.string().nullable(),
  bloodType: z.string().nullable(),
});

export const searchPatientSchema = z.object({
  name: z.string(),
});

export type AddPatientInput = z.TypeOf<typeof addPatientSchema>;

export type SearchPatientInput = z.TypeOf<typeof searchPatientSchema>;
