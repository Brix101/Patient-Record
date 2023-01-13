import z from "zod";

export const searchnBillingchema = z.object({
  name: z.string().nullish(),
  philhealth: z.boolean().default(false),
});

export type SearchnBillingInput = z.TypeOf<typeof searchnBillingchema>;
