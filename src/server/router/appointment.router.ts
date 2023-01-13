import {
  createAppointmentSchema,
  deleteAppointmentSchema,
  updateAppointmentSchema,
} from "@/schema/appointment.schema";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const appointmentRouter = createProtectedRouter()
  .query("get-appointments", {
    async resolve({ ctx }) {
      if (ctx.session) {
        const email = ctx.session.user?.email;
        const role = ctx.session.user?.role;
        const appointments = await ctx.prisma.appointment.findMany({
          where: {
            physician: {
              user: {
                email: {
                  contains: role === "PHYSICIAN" ? email : "",
                } as unknown as string,
              },
            },
          },
          include: {
            MedicalRecord: {
              include: {
                room: true,
                patient: true,
              },
            },
            physician: true,
          },
        });
        return appointments;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  })
  .mutation("create-appointment", {
    input: createAppointmentSchema,
    async resolve({ ctx, input }) {
      const { medicalRecordId, end, start, physicianId } = input;

      try {
        const appointment = await ctx.prisma.appointment.create({
          data: {
            end,
            start,
            MedicalRecord: {
              connect: {
                id: medicalRecordId,
              },
            },
            physician: {
              connect: {
                id: physicianId,
              },
            },
          },
          include: {
            MedicalRecord: {
              include: {
                room: true,
                patient: true,
                appointments: {
                  include: {
                    physician: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        return appointment;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("update-appointment", {
    input: updateAppointmentSchema,
    async resolve({ ctx, input }) {
      const { id, status, end, start, physicianId } = input;
      try {
        const appointment = await ctx.prisma.appointment.update({
          where: {
            id: id,
          },
          data: {
            status,
            end,
            start,
            physician: {
              connect: {
                id: physicianId,
              },
            },
          },
          include: {
            physician: {
              include: {
                user: true,
              },
            },
          },
        });
        return appointment;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("delete-appointment", {
    input: deleteAppointmentSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      try {
        const appointment = await ctx.prisma.appointment.delete({
          where: {
            id: id,
          },
        });
        return appointment;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  });
