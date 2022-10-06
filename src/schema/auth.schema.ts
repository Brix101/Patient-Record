import z from "zod";

export const loginUserchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginUserInput = z.TypeOf<typeof loginUserchema>;
