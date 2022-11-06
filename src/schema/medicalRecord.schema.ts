import z from "zod";

export const admitPatientSchema = z.object({
  patientId: z.number(),
  height: z.string(),
  weight: z.string(),
  bloodPressure: z.string(),
  roomId: z.number(),
  physicianId: z.number(),
  guardian: z.string(),
  chiefComplaint: z.string(),
});

export type AdmitPatientInput = z.TypeOf<typeof admitPatientSchema>;
