import { Unit } from "@prisma/client";
import z from "zod";

export const createMedicineSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: z.nativeEnum(Unit),
  price: z.number(),
});

export const updateMedicineSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  unit: z.nativeEnum(Unit),
  price: z.number(),
});

export const deleteMedicineSchema = z.object({
  id: z.number(),
});

export const searchMedicineSchema = z.object({
  name: z.string(),
});

export type CreateMedicineInput = z.TypeOf<typeof createMedicineSchema>;

export type SearchMedicineInput = z.TypeOf<typeof searchMedicineSchema>;

export type UpdateMedicineInput = z.TypeOf<typeof updateMedicineSchema>;

export type DeleteUserInput = z.TypeOf<typeof deleteMedicineSchema>;
