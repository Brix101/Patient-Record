import { admitPatientSchema } from "@/schema/medicalRecord.schema";
import { RoomStatus } from "@prisma/client";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const medicalRecordRouter = createProtectedRouter().mutation(
  "admit-patient",
  {
    input: admitPatientSchema,
    resolve: async ({ ctx, input }) => {
      const {
        patientId,
        bloodPressure,
        chiefComplaint,
        guardian,
        height,
        physicianId,
        roomId,
        weight,
      } = input;

      const isAdmitted = true;
      try {
        const record = await ctx.prisma.patient.update({
          where: {
            id: patientId,
          },
          data: {
            isAdmitted,
            medicalRecord: {
              create: {
                bloodPressure,
                chiefComplaint,
                guardian,
                height,
                weight,
                physician: {
                  connect: {
                    id: physicianId,
                  },
                },
                room: {
                  connect: {
                    id: roomId,
                  },
                },
              },
            },
          },
        });

        await ctx.prisma.room.update({
          where: {
            id: roomId,
          },
          data: {
            status: RoomStatus["OCCUPIED" as keyof typeof RoomStatus],
          },
        });

        return record;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  }
);
