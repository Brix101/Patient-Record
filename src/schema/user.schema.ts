import z from "zod";

export const role = ["ADMIN", "NURSE", "PHYSICIAN", "PHARMACIST"] as const;

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(role).default(role[1]),
  image: z.string().nullable(),
});

export const createUserOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(role),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const requestOtpSchema = z.object({
  email: z.string().email(),
});

export type requestOtpInput = z.TypeOf<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  hash: z.string(),
});
