import z from "zod";

export const createAppointmentSchema = z.object({
  physicianId: z.number(),
  scheduleStart: z.date().optional(),
  scheduleEdt: z.date().optional(),
});

export const updateAppointmentSchema = z.object({
  id: z.number(),
  physicianId: z.number(),
  scheduleStart: z.date().optional(),
  scheduleEdt: z.date().optional(),
});

export const deleteAppointmentSchema = z.object({
  id: z.number(),
});

export const searchAppointmentSchema = z.object({
  name: z.string().optional(),
});

export type CreateAppointmentInput = z.TypeOf<typeof createAppointmentSchema>;

export type SearchAppointmentInput = z.TypeOf<typeof searchAppointmentSchema>;

export type UpdateAppointmentInput = z.TypeOf<typeof updateAppointmentSchema>;

export type DeleteUserInput = z.TypeOf<typeof deleteAppointmentSchema>;
