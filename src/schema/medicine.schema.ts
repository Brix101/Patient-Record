import z from "zod";

export const createMedicineSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  intake: z.string().nullish(),
  price: z.number(),
  medicalRecordId: z.number(),
});

export const updateMedicineSchema = z.object({
  id: z.number(),
  name: z.string(),
  intake: z.string().nullish(),
  quantity: z.number(),
  price: z.number(),
});

export const deleteMedicineSchema = z.object({
  id: z.number(),
});

export const searchMedicineSchema = z.object({
  name: z.string().optional(),
});

export type CreateMedicineInput = z.TypeOf<typeof createMedicineSchema>;

export type SearchMedicineInput = z.TypeOf<typeof searchMedicineSchema>;

export type UpdateMedicineInput = z.TypeOf<typeof updateMedicineSchema>;

export type DeleteUserInput = z.TypeOf<typeof deleteMedicineSchema>;
