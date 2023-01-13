import {
  admitPatientSchema,
  billingMedicalRecordSchema,
  deleteMedicalRecordSchema,
  dischargedMedicalRecordSchema,
  getAllMedicalRecordSchema,
  getMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "@/schema/medicalRecord.schema";
import { Prisma, RoomStatus } from "@prisma/client";
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
        guardianNo,
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
                guardianNo,
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
          include: {
            medicalRecord: true,
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
            medicine: true,
            patient: true,
            physician: {
              include: {
                user: true,
              },
            },
            room: true,
            receipt: true,
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
            medicine: true,
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
            receipt: true,
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
  })
  .mutation("delete-record", {
    input: deleteMedicalRecordSchema,
    resolve: async ({ ctx, input }) => {
      const { id } = input;
      try {
        const patientRecord = await ctx.prisma.medicalRecord.delete({
          where: {
            id: id,
          },
        });

        if (patientRecord.roomId) {
          await ctx.prisma.room.update({
            where: {
              id: patientRecord.roomId as number,
            },
            data: {
              status: RoomStatus["VACANT" as keyof typeof RoomStatus],
            },
          });
        }

        return patientRecord;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("update-record", {
    input: updateMedicalRecordSchema,
    resolve: async ({ ctx, input }) => {
      const {
        id,
        bloodPressure,
        chiefComplaint,
        guardian,
        height,
        physicianId,
        roomId,
        weight,
        status,
        guardianNo,
      } = input;
      try {
        if (roomId) {
          await ctx.prisma.medicalRecord.update({
            where: {
              id: id,
            },
            data: {
              room: {
                update: {
                  status: RoomStatus["VACANT" as keyof typeof RoomStatus],
                },
              },
            },
          });
        }

        const patientRecord = await ctx.prisma.medicalRecord.update({
          where: {
            id: id,
          },
          data: {
            bloodPressure,
            chiefComplaint,
            guardian,
            height,
            weight,
            status,
            guardianNo,
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
        });

        if (patientRecord.roomId) {
          await ctx.prisma.room.update({
            where: {
              id: patientRecord.roomId,
            },
            data: {
              status: RoomStatus["OCCUPIED" as keyof typeof RoomStatus],
            },
          });
        }

        return patientRecord;
      } catch (e) {
        console.log(e);
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("billing-record", {
    input: billingMedicalRecordSchema,
    resolve: async ({ ctx, input }) => {
      const { medicalRecordId, total, philHealthId } = input;
      try {
        const patientRecord = await ctx.prisma.medicalRecord.update({
          where: {
            id: medicalRecordId,
          },
          data: {
            receipt: {
              create: {
                philHealthId,
                total: new Prisma.Decimal(total),
              },
            },
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
  })
  .mutation("discharged-record", {
    input: dischargedMedicalRecordSchema,
    resolve: async ({ ctx, input }) => {
      const {
        medicalRecordId,
        admittingDiagnosis,
        finalDiagnosis,
        otherDiagnosis,
        result,
        status,
      } = input;
      try {
        const patientRecord = await ctx.prisma.medicalRecord.update({
          where: {
            id: medicalRecordId,
          },
          data: {
            admittingDiagnosis,
            finalDiagnosis,
            otherDiagnosis,
            result,
            status,
            discharedAt: new Date(),
            room: {
              update: {
                status: RoomStatus["VACANT" as keyof typeof RoomStatus],
              },
            },
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
