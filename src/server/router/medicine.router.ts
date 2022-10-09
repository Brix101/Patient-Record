import {
  createMedicineSchema,
  deleteMedicineSchema,
  searchMedicineSchema,
  updateMedicineSchema,
} from "@/schema/medicine.schema";
import { Prisma, Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createProtectedRouter } from "@server/router/context";
import * as trpc from "@trpc/server";

export const mediceneRouter = createProtectedRouter()
  .mutation("create-medicine", {
    input: createMedicineSchema,
    resolve: async ({ input, ctx }) => {
      const { name, price, quantity, unit } = input;
      try {
        const medicine = await ctx.prisma.medicine.create({
          data: {
            name,
            price: new Prisma.Decimal(price),
            quantity,
            unit,
          },
        });

        return medicine;
      } catch (e) {
        console.log(e);
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "Medicine already exists",
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
  .query("get-medicines", {
    input: searchMedicineSchema,
    async resolve({ ctx, input }) {
      const { name } = input;
      if (ctx.session) {
        const medicines = await ctx.prisma.medicine.findMany({
          where: {
            name: { contains: name ? name : "" },
          },
          orderBy: {
            name: "asc",
          },
        });
        return medicines;
      }
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Please Login",
      });
    },
  })
  .mutation("update-medicine", {
    input: updateMedicineSchema,
    resolve: async ({ input, ctx }) => {
      const { id, name, price, quantity, unit } = input;

      try {
        const medicine = await ctx.prisma.medicine.update({
          where: {
            id: id,
          },
          data: {
            name,
            price: new Prisma.Decimal(price),
            quantity,
            unit,
          },
        });
        return medicine;
      } catch (e) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("delete-medicine", {
    input: deleteMedicineSchema,
    resolve: async ({ ctx, input }) => {
      const { role } = ctx.session.user;

      if (role === Role.ADMIN) {
        const deletedMedicine = await ctx.prisma.medicine.delete({
          where: {
            id: input.id,
          },
        });
        return { detail: "Medicine Deleted", deletedMedicine };
      }

      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid Medicine",
      });
    },
  });
