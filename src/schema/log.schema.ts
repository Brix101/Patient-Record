import z from "zod";

export const searchLogchema = z.object({
  name: z.string(),
});

export type SearchLogInput = z.TypeOf<typeof searchLogchema>;
