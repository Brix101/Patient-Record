import z from "zod";

export const createAppointmentSchema = z.object({
  medicalRecordId: z.number(),
  physicianId: z.number(),
  start: z.date().nullish(),
  end: z.date().nullish(),
});

export const updateAppointmentSchema = z.object({
  id: z.number(),
  physicianId: z.number(),
  cancelled: z.boolean(),
  start: z.date().nullish(),
  end: z.date().nullish(),
});

export const deleteAppointmentSchema = z.object({
  id: z.number(),
});

export const searchAppointmentSchema = z.object({
  physicianId: z.number().nullish(),
});

export type CreateAppointmentInput = z.TypeOf<typeof createAppointmentSchema>;

export type SearchAppointmentInput = z.TypeOf<typeof searchAppointmentSchema>;

export type UpdateAppointmentInput = z.TypeOf<typeof updateAppointmentSchema>;

export type DeleteUserInput = z.TypeOf<typeof deleteAppointmentSchema>;
