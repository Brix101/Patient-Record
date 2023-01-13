import { MedicalResult, MedicalStatus } from "@prisma/client";
import z from "zod";

export const admitPatientSchema = z.object({
  patientId: z.number(),
  height: z.string().nullish(),
  weight: z.string().nullish(),
  bloodPressure: z.string().nullish(),
  roomId: z.number().nullish(),
  physicianId: z.number().nullish(),
  guardian: z.string().nullish(),
  guardianNo: z.string().nullish(),
  chiefComplaint: z.string().nullish(),
});

export const updateMedicalRecordSchema = z.object({
  id: z.number(),
  height: z.string().nullish(),
  weight: z.string().nullish(),
  bloodPressure: z.string().nullish(),
  roomId: z.number().nullish(),
  physicianId: z.number().nullish(),
  guardian: z.string().nullish(),
  guardianNo: z.string().nullish(),
  chiefComplaint: z.string().nullish(),
  status: z.nativeEnum(MedicalStatus).nullish(),
});

export const billingMedicalRecordSchema = z.object({
  medicalRecordId: z.number(),
  philHealthId: z.string().nullish(),
  total: z.number(),
});

export const dischargedMedicalRecordSchema = z.object({
  medicalRecordId: z.number(),
  admittingDiagnosis: z.string().nullish(),
  finalDiagnosis: z.string().nullish(),
  otherDiagnosis: z.string().nullish(),
  result: z.nativeEnum(MedicalResult).nullish(),
  status: z.nativeEnum(MedicalStatus).nullish(),
});

export const getAllMedicalRecordSchema = z.object({
  patientId: z.number().optional(),
});

export const getMedicalRecordSchema = z.object({
  id: z.number().optional(),
});

export const deleteMedicalRecordSchema = z.object({
  id: z.number(),
});

export type AdmitPatientInput = z.TypeOf<typeof admitPatientSchema>;

export type UpdateMedicalRecordInput = z.TypeOf<
  typeof updateMedicalRecordSchema
>;

export type BillingMedicalRecordInput = z.TypeOf<
  typeof billingMedicalRecordSchema
>;

export type DischargedMedicalRecordInput = z.TypeOf<
  typeof dischargedMedicalRecordSchema
>;

export type GetAllMedicalRecordInput = z.TypeOf<
  typeof getAllMedicalRecordSchema
>;

export type GetMedicalRecordInput = z.TypeOf<typeof getMedicalRecordSchema>;

export type DeleteMedicalRecordInput = z.TypeOf<
  typeof deleteMedicalRecordSchema
>;
