import { addPatientSchema, searchPatientSchema } from "@/schema/patient.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

// TODO add patient crud
export const patientRouter = createProtectedRouter()
  .mutation("add-patient", {
    input: addPatientSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.patient.create({
          data: {
            ...input,
            addedById: ctx.session.user.id as unknown as number,
          },
        });

        return user;
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
        const users = await ctx.prisma.patient.findMany({
          where: {
            OR: [
              { firstName: { contains: name ? name : "" } },
              { lastName: { contains: name ? name : "" } },
            ],
          },
          orderBy: {
            lastName: "asc",
          },
        });
        return users;
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
  });
