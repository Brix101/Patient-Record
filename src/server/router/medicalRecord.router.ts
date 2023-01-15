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
import moment from "moment";

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
            isAdmitted: true,
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

        if (patientRecord) {
          await ctx.prisma.patient.update({
            where: {
              id: patientRecord.patientId,
            },
            data: {
              isAdmitted: false,
            },
          });
        }

        if (patientRecord) {
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
          const oldRecord = await ctx.prisma.medicalRecord.findUnique({
            where: {
              id: id,
            },
          });

          if (oldRecord?.roomId) {
            await ctx.prisma.room.update({
              where: {
                id: oldRecord.roomId,
              },
              data: {
                status: RoomStatus["VACANT" as keyof typeof RoomStatus],
              },
            });
          }
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
        const record = await ctx.prisma.medicalRecord.findUnique({
          where: {
            id: medicalRecordId,
          },
          include: {
            medicine: true,
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

        const admitedD = moment(record?.admittedAt);
        const nowD = moment(new Date());
        const roomTime = nowD.diff(admitedD, "days", true);
        const roomPrice = (record?.room
          ? record?.room?.price
          : 0) as unknown as number;
        const roomCharge = roomPrice * roomTime; //room total price

        const appointmentCharge = record?.appointments
          .map((appointment) => {
            const startD = moment(appointment?.start);
            const endD = moment(appointment.end);
            const totalTime = endD.diff(startD, "hours", true);
            const phyCharge = appointment.physician
              .sessionCharge as unknown as number;
            const subTotal = totalTime * phyCharge;
            const total = appointment.status === "Finished" ? subTotal : 0;

            return total;
          })
          .reduce((a, b) => a + b, 0) as unknown as number;

        const medicineCharge = record?.medicine
          .map((item) => item.total)
          .reduce((a, b) => {
            const totalA = a as unknown as string;
            const totalB = b as unknown as string;
            const total = parseFloat(totalA) + parseFloat(totalB);

            return total as unknown as number;
          }, 0) as unknown as number;

        const totalCharge = roomCharge + appointmentCharge + medicineCharge;

        const patientRecord = await ctx.prisma.medicalRecord.update({
          where: {
            id: medicalRecordId,
          },
          data: {
            receipt: {
              create: {
                philHealthId,
                appointmentCharge: new Prisma.Decimal(appointmentCharge),
                medicineCharge: new Prisma.Decimal(medicineCharge),
                roomCharge: new Prisma.Decimal(roomCharge),
                total: new Prisma.Decimal(totalCharge),
              },
            },
            appointments: {
              updateMany: {
                where: {
                  status: {
                    not: "Finished",
                  },
                },
                data: {
                  status: "Cancelled",
                },
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
            patient: {
              update: {
                isAdmitted: false,
              },
            },
            appointments: {
              updateMany: {
                where: {
                  status: {
                    not: "Finished",
                  },
                },
                data: {
                  status: "Cancelled",
                },
              },
            },
          },
        });

        if (patientRecord.roomId) {
          await ctx.prisma.room.update({
            where: {
              id: patientRecord.roomId,
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
  });
