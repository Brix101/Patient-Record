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

export const getAllMedicalRecordSchema = z.object({
  patientId: z.number().optional(),
});

export const getMedicalRecordSchema = z.object({
  id: z.number().optional(),
});

export type AdmitPatientInput = z.TypeOf<typeof admitPatientSchema>;

export type GetAllMedicalRecordInput = z.TypeOf<
  typeof getAllMedicalRecordSchema
>;

export type GetMedicalRecordInput = z.TypeOf<typeof getMedicalRecordSchema>;
