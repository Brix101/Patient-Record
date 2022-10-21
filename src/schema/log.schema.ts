import z from "zod";

export const searchLogchema = z.object({
  name: z.string(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export type SearchLogInput = z.TypeOf<typeof searchLogchema>;
