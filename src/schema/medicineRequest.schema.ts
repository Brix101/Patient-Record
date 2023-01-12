import z from "zod";

export const createMedicineReqSchema = z.object({
  quantity: z.number(),
  medicineId: z.number(),
  medicalRecordId: z.number(),
});

export const deleteMedicineReqSchema = z.object({
  id: z.number(),
});

export type CreateMedicineReqInput = z.TypeOf<typeof createMedicineReqSchema>;

export type DeleteMedicineReqInput = z.TypeOf<typeof deleteMedicineReqSchema>;
