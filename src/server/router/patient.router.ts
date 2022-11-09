import {
  addPatientSchema,
  deletePatientSchema,
  getPatientSchema,
  searchPatientSchema,
  updatePatientSchema,
} from "@/schema/patient.schema";
import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

// TODO add patient update delete to admin
export const patientRouter = createProtectedRouter()
  .mutation("add-patient", {
    input: addPatientSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const patient = await ctx.prisma.patient.create({
          data: {
            ...input,
            addedById: ctx.session.user.id as unknown as number,
          },
        });

        return patient;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("all-patients", {
    input: searchPatientSchema,
    async resolve({ ctx, input }) {
      const { name } = input;
      try {
        const patients = await ctx.prisma.patient.findMany({
          where: {
            OR: [
              { firstName: { contains: name ? name : "" } },
              { lastName: { contains: name ? name : "" } },
            ],
            NOT: {
              active: false,
            },
          },
          orderBy: {
            lastName: "asc",
          },
        });
        return patients;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .query("get-patient", {
    input: getPatientSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      try {
        const patient = await ctx.prisma.patient.findUnique({
          where: { id },
        });
        return patient;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("update-patient", {
    input: updatePatientSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      try {
        const patient = await ctx.prisma.patient.update({
          where: {
            id: id,
          },
          data: {
            ...input,
          },
        });
        return patient;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("delete-patient", {
    input: deletePatientSchema,
    resolve: async ({ ctx, input }) => {
      const { role } = ctx.session.user;

      if (role === Role.ADMIN) {
        const deletedPatient = await ctx.prisma.patient.update({
          where: {
            id: input.id,
          },
          data: {
            active: false,
            medicalRecord: {
              updateMany: {
                where: {
                  patientId: input.id,
                },
                data: {
                  active: false,
                },
              },
            },
          },
        });
        return { detail: "Patient Data Deleted", deletedPatient };
      }

      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid Patient Data",
      });
    },
  });
