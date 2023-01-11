import {
  admitPatientSchema,
  getAllMedicalRecordSchema,
  getMedicalRecordSchema,
} from "@/schema/medicalRecord.schema";
import { RoomStatus } from "@prisma/client";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const medicalRecordRouter = createProtectedRouter()
  .mutation("admit-patient", {
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
      try {
        const record = await ctx.prisma.patient.update({
          where: {
            id: patientId,
          },
          data: {
            medicalRecord: {
              create: {
                bloodPressure,
                chiefComplaint,
                guardian,
                height,
                weight,
                physician: physicianId
                  ? {
                      connect: {
                        id: physicianId,
                      },
                    }
                  : undefined,
                room: roomId
                  ? {
                      connect: {
                        id: roomId,
                      },
                    }
                  : undefined,
              },
            },
          },
        });
        if (roomId) {
          await ctx.prisma.room.update({
            where: {
              id: roomId as number,
            },
            data: {
              status: RoomStatus["OCCUPIED" as keyof typeof RoomStatus],
            },
          });
        }

        return record;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("get-allRecords", {
    input: getAllMedicalRecordSchema,
    resolve: async ({ ctx, input }) => {
      const { patientId } = input;
      try {
        const patientRecords = await ctx.prisma.medicalRecord.findMany({
          where: {
            patient: {
              id: patientId,
            },
          },
          include: {
            medicineRequest: true,
            patient: true,
            physician: {
              include: {
                user: true,
              },
            },
            room: true,
          },
          orderBy: {
            createAt: "desc",
          },
        });

        return patientRecords;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("get-record", {
    input: getMedicalRecordSchema,
    resolve: async ({ ctx, input }) => {
      const { id } = input;
      try {
        const patientRecord = await ctx.prisma.medicalRecord.findUnique({
          where: {
            id: id,
          },
          include: {
            medicineRequest: true,
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
            physician: {
              include: {
                user: true,
              },
            },
            room: true,
          },
        });

        return patientRecord;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  });
