import { CivilStatus, Role } from "@prisma/client";
import z from "zod";

export const addPatientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  birthday: z.date(),
  address: z.string().nullable(),
  mobile: z.string().nullable(),
  civilStatus: z.nativeEnum(CivilStatus),
  nationality: z.string(),
  religion: z.string(),
  weight: z.string(),
  height: z.string(),
  bloodPressure: z.string(),
  chiefComplaint: z.string(),
  physician_id: z.number(),
  room_id: z.number(),
});

export type AddPatientInput = z.TypeOf<typeof addPatientSchema>;
