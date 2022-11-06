import z from "zod";

export const searchPhysicianSchema = z.object({
  name: z.string().optional(),
});

export type SearchPhysicianInput = z.TypeOf<typeof searchPhysicianSchema>;
